# The Unified Workbench for Knowledge Graph Management Platform
If any of your projects involve creating, maintaining, or utilizing knowledge graphs, the UWKGM platform is the basic essentials that you need to build and expand your systems. Our platform offers tools that will not only help you to manage your graphs but also provide you with powerful language processing capabilities for your AI.
* *Organizations.* Aggregate your organization’s complex data and build relations with massive knowledgebases such as DBpedia and Freebase to generate insights from a wider perspective.
* *Researchers.* Easily acquire, store, access, and expand your knowledge graph, as well as streamline research procedures with our research toolkit.
* *Developers and end-users.* As an open-source project, you can customize, scale, and extend the UWKGM platform to fit your needs, while also control who gets access to your data and tools.

## Getting Started
**Full explanation and setup instruction are provided in the manual.**

You can set up the platform's development environment on Ubuntu and Mac OS. Our setup instructions require specific versions of third-party software, which we listed in the appendix of the manual. They may or may not work with other versions of the software.

### Prerequisites
In general, you need to set up the following software to develop the UWKGM platform:
1. Python 3.6 or later
2. Java Development Kit and Apache Maven
3. Homebrew on Linux or Docker (for Virtuoso)
4. MySQL or compatible systems
5. MongoDB or compatible systems
6. OpenLink Virtuoso or compatible systems

### Installing
Once you finished installing the required software, clone the platform from our GitHub repository:

```
git clone https://github.com/ichise-lab/uwkgm
```

After the cloning is done, we recommend that you set up Python virtual environment in *uwkgm/api* by navigating to the directory and type the following commands:

```
sudo apt-get install python3-venv
python3 -m venv env
```

Install additional package for *pycrpto*:

```
sudo apt-get install libgmp3-dev
```

Then activate the virtual environment and install packages from *requirements.txt*:

```
source env/bin/activate
pip install -r requirements.txt
```

Now that the required packages are installed, create a database in MySQL and you should be ready to start the API server:

```
sudo mysql -e "CREATE DATABASE UWKGM"
```

In UWKRM root directory, you will find a folder named *dev*. In the folder, we created a configuration file *conf.sh* for the development environment. **UWKGM_ENV** in the file determines what environment the platform will operate (the default is "development"). There a few steps needed to start the platform, including loading configurations, activating Python’s virtual environment, migrating Django’s database backend, and setting environment variables. We created a script for these steps in *dev-api.sh*. To start the API server, execute one of the following commands:

```
sudo bash dev-api.sh    # Ubuntu
sh dev-api.sh           # Mac OS
```

If you did not make any changes to the script, the API server should run at port 8001. Navigate to http://localhost:8001/api/v1.0/admin/ for Django’s administration page.

### Making API Requests
If you had not made any changes our account configuration (*uwkgm/api/config/accounts.yaml*), you should be able to log in to Django admin page with email `root@uwkgm.org` and password `password`. You need an authorization token to send API requests. To obtain one, send a POST request to http://localhost:8010/api/v1.0/accounts/tokens/obtain with request body `email = root@uwkgm.org` and `password = password`. The response includes access and refresh tokens; use the access token for your future API requests. If you wanted to see the content of the token, go to https://jwt.io and use the debugger to see the token's payload, such as expiration date.

When you make API requests to restricted endpoints, include `Authorization: Bearer {token}` in the headers.

## Deployment
We created a collection of Ubuntu-based scripts that automatically containerizes and deploys the platform, including its extensions and database management systems. You will need Docker, Kubernetes, and Nginx for the deployment. The scripts include installation instructions of all three software. However, we highly recommend that you familiarize yourself with the software before you move into production stage since you will need to make certain adjustments for security and scalability.

If you manage the cluster on your server, i.e., not on any third-party services such as Amazon AWS, then you will need to configure your network policy. We use Nginx to route incoming traffic to the Web API and UI containers, while also defined additional rules that direct certain traffic to other containers for maintenance. Excluding UI, which is not part of the platform, we created five deployments, each with its own Kubernetes service. In Kubernetes, a service acts as a network service for a set of pods, which encapsulate containers and necessary infrastructures. 

The API server connects to other systems using Kubernetes’ internal network. For example, it connects to the Java Web API server at http://uwkgm-spring-service. Open *uwkgm/servers/spring/spring.template.yaml* and you will see a service named *uwkgm-spring-service*. A service of type NodePort exposes itself to networks outside Kubernetes. Therefore, to access an application running in a deployment (of a set of containers), e.g., Mongo Express (MongoDB Web UI), you need to declare a service as NodePort and create a rule to direct certain traffic to the service. Once declared a NodePort, Kubernetes maps the service’s internal ports to external ports where you can connect directly from outside the cluster. Getting the ports depends on the software that you use to manage Kubernetes.

### Deployment Scripts
To deploy the platform and its dependencies on Kubernetes, you will need to run a few scripts in uwkgm/kubernetes. For users of Ubuntu 18.04, after you downloaded all project’s files, run *setup.sh* using command **bash** if you have not set up Nginx, Docker, Kubernetes, and Minikube. The script will also set up Docker’s local repository at port 5000.

```
sudo bash setup.sh
```

Before you deploy the platform, make sure that Docker has set up a local repository and Kubernetes is running:

```
sudo docker container list
sudo kubectl get service
```

The first command should display docker containers currently running. In the *IMAGE* column, there should be *registry:2* running at port 0.0.0.0:5000->5000/tcp, meaning that Docker’s local registry is working properly. The second command should list services running within the Kubernetes cluster. Once the systems are up and running, you should be ready to deploy the platform:

```
sudo bash deploy.sh
```

The deployment script will first ask you to input a few configurations, the first one being the environment where you are deploying the platform. The default configuration is `production` (press Enter or Return to use default configuration). We also defined a variant setting named `ext` for every environment. In `ext` environments, the platform’s Web API server operates on the assumption that other containers are not deployed in the same Kubernetes cluster. We use `ext` environments for testing the production server on a machine with limited resources.

The next configuration is of the master production server’s address. This setting tells the UI application where to look for the main production server. The next setting does the same for ext production server. Next, you will need to tell Virtuoso how much memory you will make available for it to operate. Virtuoso may consume a large amount of memory, depending on your graphs. For DBpedia graph, we recommend at least 32 GB of memory. Lastly, input your default graph URI, then the deployment script will show you the summary of the deployment. Press Enter or Return to start the process.

If you want to deploy specific containers into the cluster, use parameter -c or -components. Our current options are: api, mysql, mongo, virtuoso, and spring. For example:

```
sudo bash deploy.sh -c=api,mysql
```

Deployment instructions vary among the containers. However, their common process is containerizing and deploying the container to the cluster. The instructions and configurations are located in folder *kubernetes* in each component’s root directory.

At the end of the entire deployment process, the deployment script shows Docker images, services and deployments in the Kubernetes cluster, and exposed addresses and ports of the services. The script has already created networking rules for Nginx so you should be able to access the platform. However, if could not connect to it, try executing *nginx.sh* to recreate the rules:

```
sudo bash nginx.sh
```

## Acknowledgement
This work was partially supported by the New Energy and Industrial Technology Development Organization (NEDO). 