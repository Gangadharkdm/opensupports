
pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'  
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')  
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')  
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'ganga', url: 'https://github.com/Gangadharkdm/opensupports.git'
            }
        }

        stage('Deploy to Development') {
            steps {
                script {
                    withAWS(region: "${AWS_DEFAULT_REGION}", credentials: 'aws-credentials') {
                        sh """
                        aws cloudformation deploy \
                          --template-file aws_cloud_formation_templates.yaml \
                          --stack-name opensupports-dev \
                          --parameter-overrides Environment=dev \
                          --capabilities CAPABILITY_NAMED_IAM
                        """
                    }
                }
            }
        }

        stage('Test in Development') {
            steps {
                script {
                    def result = sh(script: 'curl http://<dev-environment-url>/health', returnStatus: true)
                    if (result != 0) {
                        error "Health check failed for Development!"
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                expression { return env.BRANCH_NAME == 'ganga' }  
            }
            steps {
                script {
                    withAWS(region: "${AWS_DEFAULT_REGION}", credentials: 'aws-credentials') {
                        sh """
                        aws cloudformation deploy \
                          --template-file aws_cloud_formation_templates.yaml \
                          --stack-name opensupports-staging \
                          --parameter-overrides Environment=staging \
                          --capabilities CAPABILITY_NAMED_IAM
                        """
                    }
                }
            }
        }

        stage('Test in Staging') {
            steps {
                script {
                    def result = sh(script: 'curl http://<staging-environment-url>/health', returnStatus: true)
                    if (result != 0) {
                        error "Health check failed for Staging!"
                    }
                }
            }
        }

        stage('Deploy to Production') {
            when {
                expression { return env.BRANCH_NAME == 'ganga' }  
            }
            steps {
                script {
                    withAWS(region: "${AWS_DEFAULT_REGION}", credentials: 'aws-credentials') {
                        sh """
                        aws cloudformation deploy \
                          --template-file aws_cloud_formation_templates.yaml \
                          --stack-name opensupports-prod \
                          --parameter-overrides Environment=prod \
                          --capabilities CAPABILITY_NAMED_IAM
                        """
                    }
                }
            }
        }

        stage('Test in Production') {
            steps {
                script {
                    
                    def result = sh(script: 'curl http://<production-environment-url>/health', returnStatus: true)
                    if (result != 0) {
                        error "Health check failed for Production!"
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
Conduct regular security assessments to identify and address vulnerabilities.
