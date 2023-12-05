# Shared Pipelines

Bu repository Türk Telekom Gitlab/ArgoCD dönüşümü için gereken template'ler ve referans dosyalarını içermektedir.

**BUILD**

Uygulamanın source code'u bizim gitlab alanımıza atıldığında, buradaki kodu build etmek ve imaj oluşturmak için **build** klasörü içerisindeki **templates**'in altında yer alan dosyaları refrans alarak, ilgili kaynak kod alanındaki ana dizinde oluşturduğumuz .gitlab-ci.yaml olarak oluşturmamız gerekir.

Uygulama mono-repo yapsında ise; yani servisler directroy şeklinde tek bir klasör altında oluşturulmuşsa; **build>templates** altındaki **monorepo-ci** yaml, değilse **polyrepo-ci.yaml** ile ilerlenir.

Poly-repo ve mono-repo arasındaki fark; mono-repo'da birden fazla dizin olduğu için **SERVICE_PATH** değişkenin verilmesi gerekliliğidir.

Oluşturduğumuz molyrepo veya monorepo yapısındaki ci yaml, build> pipelines altındaki tt-ci yaml ları referans alır. TT-ci yaml'larda sadece yeni bir kod türünün derlenmesi süreci için değişiklikler ve güncellemeler yapılabilir. Bunun haricinde, sadece templates altındaki dosyaları kullanıp CI süreçlerimizi sürdürebiliriz. TT-CI yaml bunun haricinde editlenmemelidir. Proje özelindeki değişiklikler, proje source-code'u altında oluşturulan .gitlab-ci.yaml içerisinde düzenlenir.

**HELM**

Uygulamının helm-chart reposundaki ana dizinde oluşturduğumuz .gitlab-ci.yaml dosyasını **helm>templates** altındaki helmmonorepo-ci veya helmpoyrepoci dosyalarından kopyalayarak oluştururuz. Buradaki template dosyaları **helm>pipelines** altındaki tt-helm-ci.yaml'ı referans alarak, helm paketleme işlemini gerçekleştirirler. 





