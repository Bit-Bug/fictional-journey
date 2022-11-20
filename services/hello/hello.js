
exports.main = async function(event, context){
    console.log('hello lambda')
    return {
        statusCode: 200,
        body: JSON.stringify(event)
    }
}
