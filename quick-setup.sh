#!/bin/bash

# StorePlatform VPS Kurulum Scripti
echo "StorePlatform VPS kurulumu başlıyor..."

# Sistem güncellemesi
echo "Sistem güncelleniyor..."
apt update && apt upgrade -y

# Docker kurulumu
echo "Docker kuruluyor..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker
usermod -aG docker $USER

# .NET Core kurulumu
echo ".NET Core kuruluyor..."
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb
apt update
apt install -y apt-transport-https dotnet-sdk-6.0

# Klasörler oluşturuluyor
echo "Klasörler oluşturuluyor..."
mkdir -p /var/www/api.muhammed.com
mkdir -p /backup
useradd -r -s /bin/false www-data 2>/dev/null || true

# Docker Compose kurulumu
echo "Docker Compose kuruluyor..."
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# PostgreSQL başlatılıyor
echo "PostgreSQL başlatılıyor..."
docker-compose up -d postgres

# 30 saniye bekle
echo "PostgreSQL başlatılması bekleniyor..."
sleep 30

# Service dosyası kopyalanıyor
echo "Service dosyası kopyalanıyor..."
cp main-api.service /etc/systemd/system/
systemctl daemon-reload

# Nginx başlatılıyor
echo "Nginx başlatılıyor..."
docker-compose up -d nginx

# Firewall ayarları
echo "Firewall ayarları yapılıyor..."
apt install ufw -y
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "Kurulum tamamlandı!"
echo "Şimdi şu adımları takip edin:"
echo "1. Publish dosyalarınızı /var/www/api.muhammed.com/ klasörüne yükleyin"
echo "2. Backup dosyanızı /backup/ klasörüne yükleyin"
echo "3. systemctl start main-api komutunu çalıştırın"
echo "4. docker exec -i storeplatform_postgres psql -U storeuser -d storeplatform < /backup/dump-hrefproHrefProdeneme-enson.sql komutunu çalıştırın"
