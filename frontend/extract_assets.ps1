$ErrorActionPreference = "Stop"

$workspace = (Get-Item .).FullName
$down = Join-Path $HOME "Downloads"

Write-Host "Finding docs in $down"

$docFiles = Get-ChildItem -Path $down -Filter "ปรับเวป*.docx"
if ($docFiles.Count -eq 0) { throw "No docx found" }
$docx = $docFiles[0].FullName

$xlsxFiles = Get-ChildItem -Path $down -Filter "เวิร์กชีต*.xlsx"
if ($xlsxFiles.Count -eq 0) { throw "No xlsx found" }
$xlsx = $xlsxFiles[0].FullName

Write-Host "Copying to workspace..."
Copy-Item $docx -Destination "$workspace\client.zip" -Force
Copy-Item $xlsx -Destination "$workspace\client.xlsx" -Force

Write-Host "Extracting ZIP..."
if (Test-Path "$workspace\client_ext") { Remove-Item "$workspace\client_ext" -Recurse -Force }
Expand-Archive "$workspace\client.zip" -DestinationPath "$workspace\client_ext" -Force

Write-Host "Extracting Text from XML..."
[xml]$x = Get-Content "$workspace\client_ext\word\document.xml" -Encoding UTF8
$ns = @{w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
$t = Select-Xml -Xml $x -XPath "//w:t" -Namespace $ns | ForEach-Object { $_.Node.InnerXML }
$t -join "`n" | Out-File "$workspace\client_text.txt" -Encoding UTF8

Write-Host "DONE"
