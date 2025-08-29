# دليل إعداد StorePlatform على VPS

## الخطوة 1: الاتصال بـ VPS عبر PuTTY

```bash
ssh root@72.60.33.111
```

## الخطوة 2: تحديث النظام وتثبيت Docker

```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# تشغيل Docker
systemctl start docker
systemctl enable docker

# إضافة المستخدم الحالي إلى مجموعة docker
usermod -aG docker $USER
```

## الخطوة 3: تثبيت .NET Core

```bash
# إضافة Microsoft repository
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb

# تثبيت .NET Core
apt update
apt install -y apt-transport-https
apt install -y dotnet-sdk-6.0
```

## الخطوة 4: إنشاء المجلدات المطلوبة

```bash
# إنشاء مجلد المشروع
mkdir -p /var/www/api.muhammed.com
mkdir -p /backup

# إنشاء مستخدم www-data إذا لم يكن موجود
useradd -r -s /bin/false www-data
```

## الخطوة 5: رفع ملفات المشروع

### باستخدام FTP أو SCP:

```bash
# من جهازك المحلي، ارفع ملفات publish
scp -r ./publish/* root@72.60.33.111:/var/www/api.muhammed.com/

# ارفع ملفات Docker
scp docker-compose.yml root@72.60.33.111:/root/
scp nginx.conf root@72.60.33.111:/root/
scp main-api.service root@72.60.33.111:/root/
```

## الخطوة 6: تشغيل PostgreSQL

```bash
# تشغيل PostgreSQL في Docker
docker-compose up -d postgres

# انتظار تشغيل PostgreSQL
sleep 30
```

## الخطوة 7: استيراد قاعدة البيانات

```bash
# رفع ملف backup إلى VPS
scp dump-hrefproHrefProdeneme-enson.sql root@72.60.33.111:/backup/

# استيراد قاعدة البيانات
docker exec -i storeplatform_postgres psql -U storeuser -d storeplatform < /backup/dump-hrefproHrefProdeneme-enson.sql
```

## الخطوة 8: إعداد .NET Core Service

```bash
# نسخ ملف service
cp main-api.service /etc/systemd/system/

# إعادة تحميل systemd
systemctl daemon-reload

# تفعيل وتشغيل الخدمة
systemctl enable main-api
systemctl start main-api

# التحقق من حالة الخدمة
systemctl status main-api
```

## الخطوة 9: تشغيل Nginx

```bash
# تشغيل Nginx في Docker
docker-compose up -d nginx

# التحقق من حالة الحاويات
docker ps
```

## الخطوة 10: فتح المنافذ في Firewall

```bash
# تثبيت ufw إذا لم يكن مثبت
apt install ufw

# فتح المنافذ المطلوبة
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 5432/tcp  # PostgreSQL (اختياري)

# تفعيل firewall
ufw enable
```

## الخطوة 11: اختبار التطبيق

```bash
# اختبار API
curl http://72.60.33.111/api/health

# اختبار قاعدة البيانات
docker exec -it storeplatform_postgres psql -U storeuser -d storeplatform -c "SELECT version();"
```

## أوامر مفيدة للصيانة:

### إيقاف الخدمات:

```bash
systemctl stop main-api
docker-compose down
```

### إعادة تشغيل الخدمات:

```bash
systemctl restart main-api
docker-compose restart
```

### عرض السجلات:

```bash
# سجلات API
journalctl -u main-api -f

# سجلات PostgreSQL
docker logs storeplatform_postgres

# سجلات Nginx
docker logs storeplatform_nginx
```

### نسخ احتياطي لقاعدة البيانات:

```bash
docker exec storeplatform_postgres pg_dump -U storeuser storeplatform > /backup/backup_$(date +%Y%m%d_%H%M%S).sql
```

## ملاحظات مهمة:

1. تأكد من تغيير كلمات المرور في ملفات التكوين
2. احتفظ بنسخة احتياطية من قاعدة البيانات
3. راقب استخدام الموارد باستخدام `htop` أو `docker stats`
4. قم بتحديث النظام بانتظام
