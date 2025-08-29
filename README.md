# StorePlatform VPS Kurulum Rehberi

Bu proje, StorePlatform uygulamanızı Ubuntu VPS üzerinde Docker ile çalıştırmak için gerekli dosyaları içerir.

## Gereksinimler

- Ubuntu 20.04+ VPS
- Root erişimi
- PuTTY veya SSH istemcisi
- FTP istemcisi (FileZilla, WinSCP vb.)

## Hızlı Kurulum

### 1. VPS'e Bağlanın

```bash
ssh root@72.60.33.111
```

### 2. Dosyaları Yükleyin

Tüm dosyaları VPS'e yükleyin:

- `docker-compose.yml`
- `nginx.conf`
- `main-api.service`
- `quick-setup.sh`

### 3. Kurulum Scriptini Çalıştırın

```bash
chmod +x quick-setup.sh
./quick-setup.sh
```

### 4. Uygulama Dosyalarını Yükleyin

- Publish dosyalarınızı `/var/www/api.muhammed.com/` klasörüne yükleyin
- Backup dosyanızı `/backup/` klasörüne yükleyin

### 5. Veritabanını İçe Aktarın

```bash
docker exec -i storeplatform_postgres psql -U storeuser -d storeplatform < /backup/dump-hrefproHrefProdeneme-enson.sql
```

### 6. API Servisini Başlatın

```bash
systemctl start main-api
systemctl enable main-api
```

## Dosya Açıklamaları

### docker-compose.yml

PostgreSQL ve Nginx servislerini tanımlar.

### nginx.conf

Nginx reverse proxy konfigürasyonu.

### main-api.service

.NET Core API servisini systemd ile yönetmek için.

### quick-setup.sh

Otomatik kurulum scripti.

## Erişim Bilgileri

- **API Endpoint**: http://72.60.33.111/api/
- **PostgreSQL**:
  - Host: 72.60.33.111
  - Port: 5432
  - Database: storeplatform
  - User: storeuser
  - Password: StorePlatform123!

## Yönetim Komutları

### Servisleri Kontrol Etme

```bash
# API durumu
systemctl status main-api

# Docker konteynerleri
docker ps

# Nginx logları
docker logs storeplatform_nginx
```

### Servisleri Yeniden Başlatma

```bash
# API yeniden başlatma
systemctl restart main-api

# Tüm servisleri yeniden başlatma
docker-compose restart
```

### Veritabanı Yedekleme

```bash
docker exec storeplatform_postgres pg_dump -U storeuser storeplatform > /backup/backup_$(date +%Y%m%d_%H%M%S).sql
```

## Güvenlik Notları

1. Varsayılan şifreleri değiştirin
2. Firewall ayarlarını kontrol edin
3. Düzenli yedekleme yapın
4. Sistem güncellemelerini takip edin

## Sorun Giderme

### API Çalışmıyorsa

```bash
# Logları kontrol edin
journalctl -u main-api -f

# Servisi yeniden başlatın
systemctl restart main-api
```

### Veritabanı Bağlantı Sorunu

```bash
# PostgreSQL durumunu kontrol edin
docker logs storeplatform_postgres

# Bağlantıyı test edin
docker exec -it storeplatform_postgres psql -U storeuser -d storeplatform
```

### Nginx Sorunları

```bash
# Nginx loglarını kontrol edin
docker logs storeplatform_nginx

# Konfigürasyonu test edin
docker exec storeplatform_nginx nginx -t
```
