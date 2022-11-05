import { Stack, StackProps } from "aws-cdk-lib"
import {Code, Function as LambdaFunction, Runtime} from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import {join} from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import {GenericTable} from './genericTable';

export class SpaceStack extends Stack {
    private api = new RestApi(this, 'fantasy-api')
    private spacesTable = new GenericTable(
        'spacesTable',
        'spaceId',
        this
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
        })
        //lambda integration
        const helloLambdaIntegration = new LambdaIntegration(helloLambda);
        const helloLambdaResource = this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);
    }
}

