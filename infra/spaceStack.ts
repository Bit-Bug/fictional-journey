import { Stack, StackProps } from "aws-cdk-lib"
import {Code, Function as LambdaFunction, Runtime} from "aws-cdk-lib/aws-lambda";
import { AuthorizationType, LambdaIntegration, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import {join} from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import {GenericTable} from './genericTable';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AuthorizerWrapper } from "./auth/authorizerWrapper";
export class SpaceStack extends Stack {
    private api = new RestApi(this, 'fantasy-api');
    private authorizer: AuthorizerWrapper;
    private spacesTable = new GenericTable(
        this, {
            tableName: 'spacesTable',
            primaryKey:'spaceId',
            createLambdaPath: 'create',
            readLambdaPath: 'read',
            updateLambdaPath: 'update',
            deleteLambdaPath: 'delete',
            secondaryIndexes: ['location']
        }
    )
    constructor(scope: Construct, id: string , props: StackProps){
        super(scope, id, props);

        this.authorizer = new AuthorizerWrapper(this,this.api);
        const optionsWithAuthorizer: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: this.authorizer.authorizer.authorizerId
            }
        }
        const helloLambda = new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
            handler: 'hello.main'
        });
        const helloNodeLambda = new NodejsFunction(this, 'nodehelloLambda', {
            entry: (join(__dirname, '..','services' , 'node-lambda', 'hello-ebuild.ts')),
            handler: 'handler'
        });

        const s3ListPolicy = new PolicyStatement();
        s3ListPolicy.addActions('s3:ListAllMyBuckets');
        s3ListPolicy.addResources('*');

        helloNodeLambda.addToRolePolicy(s3ListPolicy);
        //lambda integration
        const helloLambdaIntegration = new LambdaIntegration(helloLambda);
        const helloLambdaResource = this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration, optionsWithAuthorizer);

        const helloNodaLambdaIntegration = new LambdaIntegration(helloNodeLambda);
        const helloNodeLambddaResource = this.api.root.addResource('hellonode');
        helloNodeLambddaResource.addMethod('GET', helloNodaLambdaIntegration, optionsWithAuthorizer);

        //spaces API intgeration
        const spaceResources = this.api.root.addResource('spaces');
        spaceResources.addMethod('POST', this.spacesTable.createLambdaIntegration);
        spaceResources.addMethod('GET', this.spacesTable.readLambdaIntegration);
        spaceResources.addMethod('PUT', this.spacesTable.updateLambdaIntegration);
        spaceResources.addMethod('DELETE', this.spacesTable.deleteLambdaIntegration);

    }
}

