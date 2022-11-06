import { Stack, StackProps } from "aws-cdk-lib"
import {Code, Function as LambdaFunction, Runtime} from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import {join} from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import {GenericTable} from './genericTable';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
export class SpaceStack extends Stack {
    private api = new RestApi(this, 'fantasy-api')
    private spacesTable = new GenericTable(
        this, {
            tableName: 'spacesTable',
            primaryKey:'spaceId',
            createLambdaPath: 'create',
            readLambdaPath: 'read',
            secondaryIndexes: ['location']
        }
    )
    constructor(scope: Construct, id: string , props: StackProps){
        super(scope, id, props);
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
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);

        const helloNodaLambdaIntegration = new LambdaIntegration(helloNodeLambda);
        const helloNodeLambddaResource = this.api.root.addResource('hellonode');
        helloNodeLambddaResource.addMethod('GET', helloNodaLambdaIntegration);

        //spaces API intgefration

        const spaceResources = this.api.root.addResource('spaces');
        spaceResources.addMethod('POST', this.spacesTable.createLambdaIntegration);
        spaceResources.addMethod('GET', this.spacesTable.readLambdaIntegration);

    }
}

