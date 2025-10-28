<?php
declare(strict_types=1);

require_once __DIR__ . '/TCPDF/tcpdf.php';

$outDir = __DIR__ . '/output';
@mkdir($outDir, 0777, true);
$outFile = $outDir . '/result.pdf';
$docRoot = __DIR__;

/**
 * Try to convert SVG -> PNG using Imagick (returns path to PNG) or false.
 */
function svgToPng(string $svgPath): ?string {
    if (!class_exists('Imagick')) return null;
    try {
        $im = new Imagick();
        $svgData = file_get_contents($svgPath);
        $im->readImageBlob($svgData);
        // set density for better quality if necessary:
        $im->setImageFormat('png32');
        $tmp = tempnam(sys_get_temp_dir(), 'svg2png_') . '.png';
        $im->writeImage($tmp);
        $im->clear();
        $im->destroy();
        return $tmp;
    } catch (Throwable $e) {
        // conversion failed
        return null;
    }
}

/**
 * Flatten PNG with alpha into JPEG (white background) — prefers Imagick, falls back to GD.
 * Returns path to jpeg or null on failure.
 */
function flattenPngToJpeg(string $pngPath): ?string {
    // Imagick route
    if (class_exists('Imagick')) {
        try {
            $im = new Imagick($pngPath);
            if ($im->getImageAlphaChannel()) {
                $w = $im->getImageWidth();
                $h = $im->getImageHeight();
                $bg = new Imagick();
                $bg->newImage($w, $h, 'white');
                $bg->compositeImage($im, Imagick::COMPOSITE_OVER, 0, 0);
                $bg->setImageFormat('jpeg');
                $tmp = tempnam(sys_get_temp_dir(), 'png2jpg_') . '.jpg';
                $bg->writeImage($tmp);
                $bg->clear(); $bg->destroy();
                $im->clear(); $im->destroy();
                return $tmp;
            } else {
                // no alpha, just convert to jpeg to be safe
                $im->setImageFormat('jpeg');
                $tmp = tempnam(sys_get_temp_dir(), 'png2jpg_') . '.jpg';
                $im->writeImage($tmp);
                $im->clear(); $im->destroy();
                return $tmp;
            }
        } catch (Throwable $e) {
            // fall through to GD
        }
    }

    // GD fallback
    if (function_exists('imagecreatefrompng') && function_exists('imagejpeg')) {
        try {
            $img = imagecreatefrompng($pngPath);
            if ($img === false) return null;
            $w = imagesx($img);
            $h = imagesy($img);
            $bg = imagecreatetruecolor($w, $h);
            $white = imagecolorallocate($bg, 255, 255, 255);
            imagefilledrectangle($bg, 0, 0, $w, $h, $white);
            imagecopy($bg, $img, 0, 0, 0, 0, $w, $h);
            $tmp = tempnam(sys_get_temp_dir(), 'png2jpg_') . '.jpg';
            imagejpeg($bg, $tmp, 90);
            imagedestroy($img);
            imagedestroy($bg);
            return $tmp;
        } catch (Throwable $e) {
            return null;
        }
    }

    return null;
}

/**
 * Embed <img> srcs as base64; also try to handle SVG and PNG alpha issues.
 */
function embedImagesAsBase64(string $html, string $baseDir): string {
    return preg_replace_callback('#<img\s+[^>]*src=(["\'])([^"\']+)\1([^>]*)>#i', function($m) use ($baseDir) {
        $quote = $m[1];
        $src = $m[2];
        $rest = $m[3] ?? '';

        // external URLs: keep as-is
        if (preg_match('#^https?://#i', $src)) {
            echo "ℹ️ Внешняя картинка (оставляем): $src\n";
            return $m[0];
        }

        // remove leading slash for local paths if present
        $rel = ltrim($src, '/\\');
        $path = realpath($baseDir . DIRECTORY_SEPARATOR . $rel);
        if (!$path || !file_exists($path)) {
            echo "⚠️ Не найдена картинка: $src\n";
            return $m[0];
        }

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        // SVG: try to rasterize via Imagick -> png
        if ($ext === 'svg' || $ext === 'svgz') {
            $png = svgToPng($path);
            if ($png && file_exists($png)) {
                $data = base64_encode(file_get_contents($png));
                $mime = 'image/png';
                echo "✅ SVG -> PNG и встраиваем: $path -> $png\n";
                // remove temp png later? can't reliably delete if TCPDF still reading, leave OS to clean temp
                return '<img src="' . 'data:' . $mime . ';base64,' . $data . '"' . $rest . '>';
            } else {
                echo "⚠️ SVG не конвертирован (нет Imagick) и пропущен: $src\n";
                return ''; // remove svg if cannot convert
            }
        }

        // PNG: detect alpha and optionally flatten to JPG to avoid TCPDF png/alpha issues
        if ($ext === 'png') {
            $tryFlatten = true;
            $jpegPath = null;
            $needFlatten = false;

            // quick alpha detection using getimagesize and imagecreate
            $info = @getimagesize($path);
            if ($info && ($info[2] === IMAGETYPE_PNG)) {
                // try with Imagick if available for reliable detection
                if (class_exists('Imagick')) {
                    try {
                        $im = new Imagick($path);
                        if ($im->getImageAlphaChannel()) $needFlatten = true;
                        $im->clear(); $im->destroy();
                    } catch (Throwable $e) {
                        // fallback to GD check
                        $needFlatten = true; // assume possible alpha
                    }
                } else {
                    // fallback assume PNG may have alpha (safer)
                    $needFlatten = true;
                }
            }

            if ($needFlatten) {
                $jpegPath = flattenPngToJpeg($path);
            }

            if ($jpegPath && file_exists($jpegPath)) {
                $data = base64_encode(file_get_contents($jpegPath));
                $mime = 'image/jpeg';
                echo "✅ PNG с alpha -> JPEG и встраиваем: $path -> $jpegPath\n";
                return '<img src="' . 'data:' . $mime . ';base64,' . $data . '"' . $rest . '>';
            }

            // otherwise embed original png
            $data = base64_encode(file_get_contents($path));
            $mime = 'image/png';
            echo "✅ Встроили PNG (оригинал): $path\n";
            return '<img src="' . 'data:' . $mime . ';base64,' . $data . '"' . $rest . '>';
        }

        // JPG / JPEG / GIF / BMP — embed directly
        if (in_array($ext, ['jpg','jpeg','gif','bmp'])) {
            $mime = ($ext === 'jpg' || $ext === 'jpeg') ? 'image/jpeg' : "image/$ext";
            $data = base64_encode(file_get_contents($path));
            echo "✅ Встроили картинку: $path\n";
            return '<img src="data:' . $mime . ';base64,' . $data . '"' . $rest . '>';
        }

        // unknown extension — embed raw if possible
        $mime = mime_content_type($path) ?: 'application/octet-stream';
        $data = base64_encode(file_get_contents($path));
        echo "✅ Встроили (неизвестный тип) картинку: $path\n";
        return '<img src="data:' . $mime . ';base64,' . $data . '"' . $rest . '>';
    }, $html);
}

// Read files
$htmlPath = __DIR__ . '/pdf.html';
$cssPath  = __DIR__ . '/css/pdf.css';

if (!file_exists($htmlPath)) {
    echo "Ошибка: не найден файл pdf.html в проекте\n";
    exit(1);
}
if (!file_exists($cssPath)) {
    echo "Ошибка: не найден файл css/pdf.css в проекте\n";
    exit(1);
}

$html = file_get_contents($htmlPath);
$css  = file_get_contents($cssPath);

// Embed images
$html = embedImagesAsBase64($html, $docRoot);

// Combine CSS and HTML
$fullHtml = '<style>' . $css . '</style>' . $html;

// Create PDF
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
$pdf->SetCreator('FerrumFormat');
$pdf->SetAuthor('FerrumFormat');
$pdf->SetTitle('FerrumFormat PDF');
$pdf->SetSubject('Коммерческий прайс');

// Disable TCPDF's automatic header/footer because we render our own header in HTML
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);

// Adjust margins: left, top, right (top reduced so HTML header sits closer to page edge)
$pdf->SetMargins(10, 6, 10);
$pdf->SetAutoPageBreak(true, 10);

// font
$pdf->SetFont('dejavusans', '', 10);

// add page and render HTML
$pdf->AddPage();
$pdf->writeHTML($fullHtml, true, false, true, false, '');

// Save to file
$pdf->Output($outFile, 'F');

echo "\n🎉 Готово! Файл сохранён: $outFile\n";
