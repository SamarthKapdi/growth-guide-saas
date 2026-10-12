$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $docPath = (Resolve-Path "submission/cheerio_growth_guide_assignment.docx").Path
    $doc = $word.Documents.Open($docPath)
    # wdStatisticPages = 2
    $pages = $doc.ComputeStatistics(2)
    Write-Host "ACTUAL_WORD_PAGE_COUNT: $pages"
    $doc.Close([ref]$false)
} finally {
    $word.Quit()
}
