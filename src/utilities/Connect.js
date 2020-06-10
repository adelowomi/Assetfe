export default function( Url,Method,Data=null){
    var ModifiedUrl = process.env.REACT_APP_API_BASEURL_Test + Url;
    var Response = fetch(ModifiedUrl,{
        method: Method,
        body:Data,
        headers:{
            'Content-Type': 'application/json'
        }
      })
    
    return Response;
}