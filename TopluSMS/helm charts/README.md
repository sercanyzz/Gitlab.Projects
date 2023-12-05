# Helm Chart
## Helm Nedir?
- Helm, Kubernetes platformunda kullanılan bir paket yönetim sistemidir. Kubernetes ortamında uygulamaları, bağımlılıklarını veya öngereksinimlerini yönetmek, kurulan uygulamarın versiyonlamasını yapmak için helm paket yönetimi kullanılabilir. Helm paket yönetim sistemini linux platformlarda bir uygulama kurmak için gereken apt, yum, rpm, dpkg gibi paket yönetim sistemlerine benzetebiliriz.

- Helm uygulamalarınızı yönetirken karmaşıklığı azaltır. Kolay güncelleme yapmanızı ve uygulamaların platformlar arası basit bir şekilde paylaşılmasını sağlar.  Ayrıca gerektiği zaman eski versiyonlarınızdan birine kolayca rollback yapabilmenizi sağlar.

- Helm Chart'ı Kubernetes üzerine kurulacak bir uygulama için gerekli olan bilgiler topluluğunu barındıran dosyadır. Örnek vermek gerekirse Kubernetes deploymentlarında bulunan, service bilgisi, repository bilgisi, ingress bilgisi, load balancer bilgisi gibi bir çok bilgiyi yaml formatında barındırır ve versiyonlar. Bu bilgileri helm yapısı içerisinde parametrik hale getirip güvenli ve otomatize kurulumlar gerçekleştirebilir.

- Aşağıda da bir helm chart'ındaki dosyaları görebiliriz:

```
+--- .gitlab-ci.yml
+--- .helmignore
+--- Chart.yaml
+--- README.md
+--- site-config-example.yaml
+--- templates
|   +--- .gitkeep
|   +--- configmap.yaml
|   +--- deployment.yaml
|   +--- hpa.yaml
|   +--- ingress.yaml
|   +--- NOTES.txt
|   +--- route.yaml
|   +--- service.yaml
|   +--- serviceaccount.yaml
|   +--- _helpers.tpl
+--- values.yaml
```

- Templates klasörü altındaki kubernetes manifesto dosyaları gerekli durumlarda kubernetese uygulanabilir. Bu dosyalar da Kubernetes’in anlayacağı **yaml** formatında yazılır.

- **values.yaml** dosyasında chart’ın değişenleri bulunmaktadır.

- **_helpers.tpl** dosyasında ise var olan değişkenlere göre yeni değişkenler oluşturulur.


----

## deployment.yaml

### Deployment:

ReplicaSet’in yanında rolling update yapma imkanı veren ilgili podu ve replica sayılarını belirttiğimiz bir Kubernetes objesidir. Deployment, arka tarafta ReplicaSet kullanmaktadır. Birden fazla ReplicaSet kullanabildiği için de rolling update yapma imkanına tanır ve bir önceki versiyona rollback yapma imkanı da verir. 

>    - Rolling update: Pod'ların ayrı ayrı update edilmesi işlemidir. Yeni versiyona sahip podlar ayağa kalktıkça sahip olunan Pod’lar öldürülür.  
V1-V1-V1 > V1-V1-V2 > V1-V2-V2 > V2-V2-V2 şeklinde örneklendirilebilir.Böylelikle downtime oluşmaması amaçlanır.

Aşağıda ise Helm chart ile oluşturulan bir deployment şablon’unu görebilirsiniz. Burada `{{ }}` arasında verilen değerler değişkenler kullanarak oluşturulur. Örneğin `{{ .Values.replicaCount }}` değerini `replicaCount` değişkeninden alır. Ya da `{{ include "tt-common.fullname" . }}` değişkenini helpers.tpl dosyanın içinde oluşturarak alacaktır.

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "tt-common.fullname" . }}
  labels:
    {{- include "tt-common.labels" . | nindent 4 }}
  {{- if .Values.config }}
  annotations:
    checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
  {{- end }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "tt-common.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      {{- with .Values.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        {{- include "tt-common.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "tt-common.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      #todo: add initcontainers as pluggable component
      # {{- if .Values.initContainers }}
      # initContainers:
      #   {{- toYaml .Values.initContainers | nindent 8 }}
      # {{- end }}
      containers:
        - name: {{ .Chart.Name }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: pod-port
              containerPort: {{ .Values.containerPort }}
              protocol: TCP
          {{- if .Values.livenessProbe }}
          livenessProbe: {{ toYaml .Values.livenessProbe | nindent 12 }}
          {{- end }}
          {{- if .Values.readinessprobe }}
          readinessProbe: {{ toYaml .Values.readinessProbe | nindent 12 }}
          {{- end }}
          resources: {{- toYaml .Values.resources | nindent 12 }}
          env: 
          {{- if .Values.extraEnvVars }}
          {{- tpl (toYaml .Values.extraEnvVars) $ | nindent 12 }}
          {{- end }}
          volumeMounts:
            {{- if .Values.config }}
            - mountPath: {{ .Values.config_path }}
              subPath: properties
              name: "config"
            {{- end }}
      {{- with .Values.nodeSelector }}
      nodeSelector: {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity: {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations: {{- toYaml . | nindent 8 }}
      {{- end }}
      volumes:
        {{- if .Values.config }}
        - name: "config"
          configMap:
            name: {{ include "tt-common.fullname" . }}
        {{- end }}
```

### Readiness Probe ve Liveness Probe eklenmesi

Kubernetes üzerinde bir pod’un çalışır hale geldiğini ve sağlıklı çalışıp çalışmadığını Kubernetes’in kontrol etmesini sağlayan yapılardır.

- Aşağıda örnek Liveness Probe parametreleri verildi:
```
livenessProbe: 
    httpGet: 
        path: /healthz 
        port: 8888 
    initialDelaySeconds: 5 
    periodSeconds: 3
```
- Yukarıdaki örnekte pod çalıştırıldıktan sonra ilk olarak 5 saniye, sonra da her 3 saniyede bir 8888 portundan /healthz uç noktasına http Get işlemi yapılması istenmiştir. Bu talebe 2xx veya 3xx HTTP kodlarından birinin dönmesi halinde Kubernetes pod’un hayatta olduğunu kabul eder, aksi halde podun restart edilmesi işlemini başlatır.

- **Readiness Probe**, pod hayatta olsa da hizmet verebilir olup olmadığının kontrol etmektedir. Aşağıdaki örnekte pod çalıştırıldıktan sonra ilk olarak 15 saniye, sonra da her 30 saniyede bir 8888 portundan /healthz uç noktasına http Get işlemi yapılması istenmiştir.

```
readinessProbe: 
    httpGet: 
        path: /healthz 
        port: 8888 
    initialDelaySeconds: 15 
    periodSeconds: 30
```
>    - path istenilen bir yer üzerinden de verilebilir. Örneğin `path: /health` şeklinde de tanımlanabilmektedir.

Readiness ve Liveness Prob kubernetes açısından önemli bir parametredir. Bunu destekleyecek şekilde uygulamanın hazırlanması önerilir.

   - Readines ve Liveness Probların Helm’de işlenmesi için aşağıdaki parametreler kullanılabilir:
```
livenessProbe:
   failureThreshold: 1
   httpGet:
     path: /
     port: http
     scheme: HTTP
   initialDelaySeconds: 60
   periodSeconds: 10
   successThreshold: 1
   timeoutSeconds: 5
```
```
readinessProbe:
   failureThreshold: 3
   httpGet:
     path: /
     port: http
     scheme: HTTP
   initialDelaySeconds: 30
   periodSeconds: 10
   successThreshold: 1
   timeoutSeconds: 5
```

### Limit ve request kaynaklarının tanımlanması

Kubernetes’de pod sınırlarını belirlemek için limit ve request parametreleri kullanılır. Pod'lar, `requests` de verilen kaynak miktarı ile açılır ve `limits` ile verilen kaynaklar kadar kullanım yapabilir.  Bu da cluster'ın genel kararlılığını korumayı amaçlar. 

   - Aşağıda örnek bir Pod Yaml'ı verildi:
```
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

- Örnekte görüldüğü gibi `“app"` ve `"log-aggregator"` uygulamaları konteyner içinde çalışmaktadır. Resources tanımlaması yapılırken `requests`  uygulamanın kullanacağı minimum memory ve CPU değerlerini belirtmektedir. Limits ise uygulamanın kullanabileceği üst sınır kaynak değerlerini içerir.

Helm’de kullanılabilmesi için Values dosyasında, Resources Values kullanım örneği aşağıdaki gibidir:

```
resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

----

## configmap.yaml

Aşağıda da configmap şablonunu görebilirsiniz. Bu configmap eğer `config`  değişkeni varsa oluşturulmaktadır. Gereken konfigurasyonu `data` altında oluşturarak deployment’un(pod’un) içine atabileceğiz. Bu konfigurasyon data’sını da `config_path`  değişkeninin olduğu dosya’ya yazmış olacağız. Örneğin bu değişkeni **“/app/properties”** olarak verirsek config değişkeninin altındaki data’ları **“/app/properties”** dosyasında görmüş olacağız. 

```
{{- if .Values.config }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "tt-common.fullname" . }}
  labels:
    {{- include "tt-common.labels" . | nindent 4 }}
data:
  {{- toYaml .Values.config | nindent 2 }}
{{- end }}
```

### Uygulama konfigürasyonlarını Pod üzerinde dosya olarak nasıl tutabiliriz?

- Kubernetes’de ortam bazlı konfigürasyonlar Configmap’lerde tutulur. Configmap konteyner imajı içerisindeki konfigürasyon detaylarını ayrı olarak tutmaya yarayan bir nesnedir. 

- Bir Pod üzerindeki konfigürasyonda değişiklik yapmak istenilirse Yaml dosyasını yeniden oluşturup tekrar deploy etmeniz gerekmektedir.

- Config altında bir tanımlama yapılması durumunda, Config map oluşturulur ve pod otomatik olarak tanımlanır.

-  “ConfigMap” ile pod üzerinde bir değişiklik yapmadan dışarıdan istenilen değişikliklerin uygulanması sağlanılır. Değişiklik yapılırsa podu restart etmek gerekir. Helm ile upgrade sırasında configmap’te bir değişiklik yapılmış ama pod imajı değişmemişse bile helm pod’u restart edecektir.


----

## secret.yaml

Kubernetes’de şifre gibi önemli bilgilerin tutulatacağı objedir.



### Uygulama ile ilgili şifreleri POD üzerinde dosya olarak nasıl tutabiliriz?

- Kubernetes’de şifreler “secret” objelerinde tutulur. Bir secret'ı Docker imajı içinde bir dosyada tutmak için  secret yaml file oluşturulur. Aşağıda örnek bir secret şablonu bulabilirsiniz:

```
{{- if .Values.secret }}
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "tt-common.fullname" . }}
  labels:
    {{- include "tt-common.labels" . | nindent 4 }}
type: Opaque
data:
  username: {{ default "" .Values.secret.username | b64enc | quote }}
  password: {{ default "" .Values.secret.password | b64enc | quote }}
{{- end }}
```

- Values dosyasında `secret.username` ve `secret.password` tanımlayınca bu secret dosyası kullanılarak bir obje oluşturulacaktır.

### Uygulama ile ilgili şifrelerin POD’da environment variable olarak oluşturulması

- Secretları işletim sistemi environment variable'ında tutmak için Secret values kullanılmaktadır. Oluşturulan Secret, values dosyasındaki `secret.username` ve `secret.password` keyine atadığımız değerler ile environment variables olarak tanımlanmaktadır.


----

## Services

- Her yapının birbirinden haberdar olmasını sağlayan birimdir. Trafiğin sağlıklı podlara aktarılmasını sağlar. Clientlardaki IP'lerin kalıcı ve stabil olmasını sağlar. Servisler bir ya da daha fazla port’un bir ya da bir grup pod’a yönlendirilmesinden sorumlu bileşenlerdir.

- Açılan servis portlarına sadece cluster içerisinden erişelebileceği gibi aynı zamanda node üzerinden ya da load balancer üzerinden de erişim sunulabilir. Bu özellikleri sayesinden servisler podların erişim açısından grupladıkları gibi dışarıya açılabilmelerini de sağlamaktadırlar. (Bir Kubernetes Servisi ClusterIP, NodePort, LoadBalacer ve ExternalName olmak üzere 4 farklı tür olabilir.)

- Helm chart'ında **services.yaml** gibi şablonlar ile farklı uygulamalar için farklı servisler oluşturulabilir

- **ClusterIP** türü ile tanımlanan bir Kubernetes Service’i cluster dışından erişilebilir değildir. ClusterIP türü için servise sanal bir cluster ip adresi oluşturularak atanır. Erişimler atanan bu ip adresi üzerinden gerçekleştirilir.

- **NodePort** türü ile tanımlanan bir Kubernetes Service’i cluster dışından da erişilebilir olacaktır. Tanımlama sırasında verilen NodePort değeri ile her bir Cluster Node’u üzerinde port açılarak servise yönlendirilir. Bu haliyle, aksi belirtilmediği sürece, herhangi bir node üzerinden servise erişilebilir.

- **LoadBalancer** türü ile tanımlanan bir Kubernetes Service’i aynı NodePort türünde olduğu gibi dışarıdan erişilebilir olacaktır. NodePort’tan farklı olarak LoadBalancer türünde Kubernetes Node’larının önünde önceden konumlanmış yük dengeleyiciler bulunmaktadır. Dışarıdan load balancer’a gelen trafik arkaplandaki pod’lara yönledirilecektir.

- **ExternalName** türü ile tanımlanan bir Kubernetes Service’i önceki türlerde olduğu gibi selector kullanmak yerine DNS adını kullanacaktır. Bu türde, önceki türlerde olan proxy ya da forward işlemleri kullanılmamaktadır. Yönlendirme işlemi DNS seviyesinde gerçekleşmektedir.

----


## Namespace (Project)

Containerlar arasındaki izolasyonu sağlamak için kullanılır. Her proje için ayrı bir namespace kullanılır.

----

## route.yaml

Burada uygulamaya dışarıdan erişeceğiniz URL’i vererek bir route oluşturabilirsiniz. Eğer; 
```
route:
  enabled: true
```
değişkeni vermişseniz aşağıdaki route manifestosu kubernetes’e uygulanacaktır.

```
{{- if .Values.route.enabled -}}
kind: Route
apiVersion: route.openshift.io/v1
metadata:
  name: {{ include "tt-common.fullname" . }}
  labels:
    {{- include "tt-common.labels" . | nindent 4 }}
  {{- if .Values.route.annotations }}
  annotations: {{ toYaml .Values.route.annotations | nindent 4 }}
  {{- end }}
spec:
  host: {{ .Values.route.host.name | quote }}
  to:
    kind: Service
    name: {{ include "tt-common.fullname" . }}
    weight: 100
  port:
    targetPort: {{ .Values.service.name }}
  wildcardPolicy: None
  tls:
    insecureEdgeTerminationPolicy: Redirect
    termination: edge
{{- end }}
```

- Burada ulaşım URL’ini aşağıdaki gibi site spesifik values dosyanıza vermeniz gerekmektedir.

```
route:
  host:
    name: myserviceendpoint.paas.turktelekom.intra
```

----

## values.yaml

Bu dosyada default değişken değerleri verilmektedir. Her ortama göre ayrı bir (site spesifik) values dosyası oluşturarak bu dosyadaki değerleri override etmemiz gerekecektir. Örneğin `DEV` ortamlarında pod replika sayısını (replicaCount) 2 tutmak yeterli olacakken `PROD` ortamlarında bunu 4 yapmamız gerekir. Bunu da belirttiğimiz site-spesifik values’lar ile değiştireceğiz.


```
# Default values for tt-common.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

#todo: group variables for different services on same application?
#serviceName:

replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  # Overrides the image tag whose default is the chart appVersion.
  tag: ""

imagePullSecrets: []
#imagePullSecrets: 
#  - name: "mysecret"

nameOverride: ""
fullnameOverride: ""

#initContainers: {}

serviceAccount:
  # Specifies whether a service account should be created
  create: false
  # Annotations to add to the service account
  annotations: {}
  # The name of the service account to use.
  # If not set and create is true, a name is generated using the fullname template
  name: ""

podAnnotations: {}

podSecurityContext: {}
  # fsGroup: 2000

securityContext: {}
  # capabilities:
  #   drop:
  #   - ALL
  # readOnlyRootFilesystem: true
  # runAsNonRoot: true
  # runAsUser: 1000

service:
  name: svc-port
  type: ClusterIP
  port: 80

containerPort: 80

livenessProbe: {}
  # failureThreshold: 1
  # httpGet:
  #   path: /
  #   port: http
  #   scheme: HTTP
  # initialDelaySeconds: 60
  # periodSeconds: 10
  # successThreshold: 1
  # timeoutSeconds: 5

readinessProbe: {}
  # failureThreshold: 3
  # httpGet:
  #   path: /
  #   port: http
  #   scheme: HTTP
  # initialDelaySeconds: 30
  # periodSeconds: 10
  # successThreshold: 1
  # timeoutSeconds: 5

extraEnvVars:
## Array containing extra env vars
## extraEnvVars:
##  - name: JAVA_OPTS
##    value: -Djava.security.egd=file:/dev/./urandom

ingress:
  enabled: false
  className: ""
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

route:
  enabled: false
  annotations: {}
  host:
    name: chart-example.local
    path: /
    pathType: ImplementationSpecific
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #   cpu: 100m
  #   memory: 128Mi
  # requests:
  #   cpu: 100m
  #   memory: 128Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80
  # targetMemoryUtilizationPercentage: 80

nodeSelector: {}

tolerations: []

affinity: {}

#default config mount path
config_path: "/app"

config: {}
#  properties: |
#    myfirstconfigkey: meyfirstconfigvalue

```
