$port = 8080
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
$listener.Start()
Write-Host "Local TCP Web Server running on http://localhost:$port..."

$root = Get-Location

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream)
        
        $requestLine = $reader.ReadLine()
        if ($null -ne $requestLine) {
            $parts = $requestLine.Split(" ")
            if ($parts.Length -gt 1) {
                $urlPath = $parts[1]
                if ($urlPath -eq "/") { $urlPath = "/index.html" }
                
                if ($urlPath.Contains("?")) {
                    $urlPath = $urlPath.Substring(0, $urlPath.IndexOf("?"))
                }

                $relativeFile = $urlPath.TrimStart('/').Replace('/', '\')
                $filePath = [System.IO.Path]::Combine($root, $relativeFile)

                if (Test-Path $filePath -PathType Leaf) {
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $mime = switch ($ext) {
                        ".html" { "text/html; charset=utf-8" }
                        ".css"  { "text/css; charset=utf-8" }
                        ".js"   { "text/javascript; charset=utf-8" }
                        ".jpg"  { "image/jpeg" }
                        ".png"  { "image/png" }
                        default { "application/octet-stream" }
                    }

                    $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bytes, 0, $bytes.Length)
                } else {
                    $notFound = "HTTP/1.1 404 Not Found`r`nContent-Length: 0`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($notFound)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                }
            }
        }
        $stream.Close()
        $client.Close()
    } catch {
        # continue handling connections
    }
}
