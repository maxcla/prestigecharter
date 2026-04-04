$navLinks = @(
    @{ href = 'index.html'; fr = 'Accueil'; en = 'Home' },
    @{ href = 'yacht.html'; fr = 'Le Yacht'; en = 'The Yacht' },
    @{ href = 'experiences.html'; fr = 'Expériences'; en = 'Experiences' },
    @{ href = 'histoire.html'; fr = 'Notre Histoire'; en = 'Our Story' },
    @{ href = 'yachtclub.html'; fr = 'Yacht Club'; en = 'Yacht Club' },
    @{ href = 'tarifs.html'; fr = 'Tarifs'; en = 'Rates' },
    @{ href = 'reservation.html'; fr = 'Réservation'; en = 'Booking' },
    @{ href = 'contact.html'; fr = 'Contact'; en = 'Contact' }
)

function Build-Links {
    param(
        [string]$Active,
        [string]$Class
    )

    $lines = ''
    foreach ($link in $navLinks) {
        $cls = $Class
        if ($link.href -eq $Active) {
            $cls += ' active'
        }
        $lines += '        <a href="' + $link.href + '" class="' + $cls + '" data-fr="' + $link.fr + '" data-en="' + $link.en + '">' + $link.fr + '</a>' + "`n"
    }
    return $lines.TrimEnd()
}

$template = @'
  <!-- HEADER -->
  <header id="header" class="header">
    <div class="header-inner container">
      <a href="index.html" class="logo" aria-label="Prestige Charter - Accueil">
        <svg class="logo-anchor" width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="4" r="2.5" stroke="#C9A84C" stroke-width="1.3"/>
          <line x1="11" y1="6.5" x2="11" y2="21" stroke="#C9A84C" stroke-width="1.3"/>
          <line x1="2" y1="10" x2="20" y2="10" stroke="#C9A84C" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M3 19 Q3 25 11 25 Q19 25 19 19" stroke="#C9A84C" stroke-width="1.3" fill="none" stroke-linecap="round"/>
          <line x1="3" y1="16" x2="3" y2="19" stroke="#C9A84C" stroke-width="1.3" stroke-linecap="round"/>
          <line x1="19" y1="16" x2="19" y2="19" stroke="#C9A84C" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <div class="logo-text">
          <span class="logo-prestige">PRESTIGE</span>
          <span class="logo-charter">CHARTER</span>
        </div>
      </a>
      <nav class="main-nav" aria-label="Navigation principale">
{desktop_links}
      </nav>
      <div class="header-actions">
        <button id="lang-toggle" class="lang-toggle" aria-label="Toggle language">EN</button>
        <button id="nav-burger" class="nav-burger" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- MOBILE MENU -->
  <div id="mobile-menu" class="mobile-menu" aria-hidden="true">
    <div class="mobile-menu-inner">
      <nav class="mobile-menu-nav">
{mobile_links}
      </nav>
      <div class="mobile-menu-footer">
        <a href="tel:+33652192414" class="mobile-phone">+33 6 52 19 24 14</a>
        <a href="https://wa.me/33652192414" class="btn btn-primary" data-fr="WhatsApp" data-en="WhatsApp">WhatsApp</a>
      </div>
    </div>
  </div>
'@

$markers = @(
    '<!-- HEADER -->',
    '<header',
    '<!-- MOBILE NAV -->',
    '<div class="mobile-nav"',
    "<div class='mobile-nav'",
    '<div id="mobile-menu"',
    '<div class="mobile-menu"',
    "<div class='mobile-menu'"
)

$endMarkers = @(
    '<main',
    '<section'
)

Get-ChildItem -Filter '*.html' | Sort-Object Name | ForEach-Object {
    $path = $_.FullName
    $text = Get-Content -Path $path -Raw
    $desktopLinks = Build-Links -Active $_.Name -Class 'nav-link'
    $mobileLinks = Build-Links -Active $_.Name -Class 'mobile-link'
    $replacement = $template -replace '\{desktop_links\}',$desktopLinks -replace '\{mobile_links\}',$mobileLinks

    $startPositions = @()
    foreach ($marker in $markers) {
        $idx = $text.IndexOf($marker, [StringComparison]::OrdinalIgnoreCase)
        if ($idx -ge 0) { $startPositions += $idx }
    }

    if ($startPositions.Count -eq 0) {
        Write-Host "WARNING: no header/mobile marker found in $($_.Name)"
        return
    }

    $startIndex = ($startPositions | Measure-Object -Minimum).Minimum

    $endIndex = $null
    foreach ($marker in $endMarkers) {
        $idx = $text.IndexOf($marker, $startIndex, [StringComparison]::OrdinalIgnoreCase)
        if ($idx -ge 0) {
            if ($endIndex -eq $null -or $idx -lt $endIndex) {
                $endIndex = $idx
            }
        }
    }

    if ($endIndex -eq $null) {
        Write-Host "WARNING: no content boundary found after header/mobile block in $($_.Name)"
        return
    }

    $newText = $text.Substring(0, $startIndex) + $replacement + $text.Substring($endIndex)
    if ($newText -eq $text) {
        Write-Host "WARNING: header block not replaced in $($_.Name)"
    } else {
        Set-Content -Path $path -Value $newText
        Write-Host "Updated $($_.Name)"
    }
}
