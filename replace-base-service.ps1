# بسم الله الرحمن الرحيم
# Bu script, belirtilen dizindeki tüm .ts, .js, .tsx, .jsx dosyalarında
# birden fazla import ifadesini topluca değiştirir.

$path = "./src/app/features"
$replacements = @{
    "@common/services/Auth/base-service.service" = "@coder-pioneers/shared"
    '@common/services/Auth/http-client.service' = "@coder-pioneers/shared"
    '@core/services/alert.service' = "@coder-pioneers/shared"
    '@common/services/Auth/permissions.service' = "@coder-pioneers/shared"
    '@core/services/dialog.service' = "@coder-pioneers/shared"
    '@shared/base/base.component' = "@coder-pioneers/shared"
    '@common/models/material-list.module' = "@coder-pioneers/shared"
    '@common/services/table/advanced-sort.service' = "@coder-pioneers/shared"
    '@contracts/base/column-def' = "@coder-pioneers/shared"
    '@core/services/searchbar.service' = "@coder-pioneers/shared"
    '@shared/directives/delete.directive' = "@coder-pioneers/shared"
    '../../../../contracts/base-contract' = "@coder-pioneers/shared"
    '@contracts/base/responses-hr' = "@coder-pioneers/shared"
    'ResponsesHr' = "BaseResponses"
    '@common/models/material-dialog.module' = "@coder-pioneers/shared"
    '../../../../shared/services/basedialog.service' = "@coder-pioneers/shared"
    '@shared/components/base/dialog/coder-pioneers-dialog/coder-pioneers-dialog.component' = "@coder-pioneers/shared"
    '@common/models/material-create.module' = "@coder-pioneers/shared"
    '@common/models/material.module' = "@coder-pioneers/shared"
    '@shared/components/ui/loading' = "@coder-pioneers/shared"
    '@common/services/Photo.service' = "@coder-pioneers/shared"
    '@core/services/image.service' = "@coder-pioneers/shared"
    '@common/utils/date-format' = "@coder-pioneers/shared"

    '@contracts/base/list-id-and-names' = "@coder-pioneers/shared"
    '@shared/components/base/coder-pioneers/coder-pioneers-create/coder-pioneers-create.component' = "@coder-pioneers/ui-layout-components"
    '@shared/components/base/coder-pioneers/coder-pioneers-list/coder-pioneers-list.component' = "@coder-pioneers/ui-layout-components"
    '@shared/components/base/coder-pioneers/coder-pioneers.component' = "@coder-pioneers/ui-layout-components"
    'coderPioneersListComponent' = "CoderPioneersListComponent"

    '@common/services/export/professional-excel.service' = "@coder-pioneers/shared"
    '@common/services/export/professional-csv.service' = "@coder-pioneers/shared"
    '@common/services/export/professional-json.service' = "@coder-pioneers/shared"
    '@common/services/export/professional-html-export.service' = "@coder-pioneers/shared"
    '@common/services/export/professional-txt.service' = "@coder-pioneers/shared"

}

Get-ChildItem -Path $path -Recurse -Include *.ts,*.js,*.tsx,*.jsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $content = $content -replace [regex]::Escape($old), $new
    }
    Set-Content $_.FullName $content
}

# Açıklama: Yukarıdaki komut, her dosyayı bir kez okur, tüm değişiklikleri yapar ve bir kez yazar.
# بسم الله الرحمن الرحيم
# Bu script, belirtilen dizindeki tüm .ts, .js, .tsx, .jsx dosyalarında
# '@common/services/Auth/base-service.service' ifadesini '@coder-pioneers/shared' ile değiştirir.

# $path = "./projects/test-app"
# $old = "@common/services/Auth/base-service.service"
# $new = "@coder-pioneers/shared"
# $old2 = '@common/services/Auth/http-client.service'
# $new2 = "@coder-pioneers/shared"
# $old3 = '@core/services/alert.service'
# $new3 = "@coder-pioneers/shared"
# $old4 = '@common/services/Auth/permissions.service'
# $new4 = "@coder-pioneers/shared"
# $old5 = '@core/services/dialog.service'
# $new5 = "@coder-pioneers/shared"
# $old6 = '@shared/base/base.component'
# $new6 = "@coder-pioneers/shared"

# $old7 = '@shared/components/base/coder-pioneers/coder-pioneers-create/coder-pioneers-create.component'
# $new7 = "@coder-pioneers/ui-layout-components"
# $old8 = '@shared/components/base/coder-pioneers/coder-pioneers-list/coder-pioneers-list.component'
# $new8 = "@coder-pioneers/ui-layout-components"
# $old9 = '@shared/components/base/coder-pioneers/coder-pioneers.component'
# $new9 = "@coder-pioneers/ui-layout-components"



# Get-ChildItem -Path $path -Recurse -Include *.ts,*.js,*.tsx,*.jsx | ForEach-Object {
#     (Get-Content $_.FullName) -replace $old, $new | Set-Content $_.FullName
#     (Get-Content $_.FullName) -replace $old2, $new2 | Set-Content $_.FullName
#     (Get-Content $_.FullName) -replace $old3, $new3 | Set-Content $_.FullName
#     (Get-Content $_.FullName) -replace $old4, $new4 | Set-Content $_.FullName
#     (Get-Content $_.FullName) -replace $old5, $new5 | Set-Content $_.FullName
#     (Get-Content $_.FullName) -replace $old6, $new6 | Set-Content $_.FullName
#     (Get-Content $_.FullName) -replace $old7, $new7 | Set-Content $_.FullName
#     (Get-Content $_.FullName) -replace $old8, $new8 | Set-Content $_.FullName
#     (Get-Content $_.FullName) -replace $old9, $new9 | Set-Content $_.FullName
# }

# # Açıklama: Yukarıdaki komut, tüm ilgili dosyaları tarar ve istenen değişikliği uygular.
# powershell -ExecutionPolicy Bypass -File replace-base-service.ps1 //bu komutu çalıştırınız.
