# Kubernetes Ingress Setup

## Prerequisites
- NGINX Ingress Controller installed on your EKS cluster

### Install NGINX Ingress Controller
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
```

Or using kubectl:
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/aws/deploy.yaml
```

## Apply Ingress Configuration
```bash
kubectl apply -f k8s/ingress.yaml
```

## Get Ingress IP/Hostname
```bash
kubectl get ingress microservices-ingress
```

Wait a few minutes for the LoadBalancer to assign an external IP. Once available, you can access:
- Frontend: `http://<EXTERNAL-IP>/`
- User API: `http://<EXTERNAL-IP>/api/users`
- Todo API: `http://<EXTERNAL-IP>/api/todos`

## Update Frontend Service to ClusterIP (Optional)
For Ingress to work properly, update frontend service type from LoadBalancer to ClusterIP:

```bash
kubectl patch service frontend -p '{"spec":{"type":"ClusterIP"}}'
```

## Routing Rules
- `/` → frontend:3000
- `/api/users` → user-service:8081
- `/api/todos` → todo-service:8082

## For Local Testing (Minikube/Docker Desktop)
Add entry to `/etc/hosts` (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 microservices.local
```

Then access: `http://microservices.local`

## AWS EKS Configuration
If using AWS EKS with ALB (Application Load Balancer), use ALB Ingress Controller instead:

```bash
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system
```

Then create ALB Ingress:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: microservices-alb
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  ingressClassName: alb
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 3000
      - path: /api/users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 8081
      - path: /api/todos
        pathType: Prefix
        backend:
          service:
            name: todo-service
            port:
              number: 8082
```