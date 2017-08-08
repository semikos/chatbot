'use strict';
//web scapping du site malloc pour extraire les informa avec prestashop api :
// recherche avec mot cle
//recerche des produits
//recherche des catégories

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const formatMess = require('../templates/format.js');
const fbTemplate =  formatMess.fbTemplate;
const key = process.env.PRESTA_SEARCH_VERIFY_TOKEN;
const myshoplink = "http://www.malloc.rocks/shop";
var xml2js = require ('xml2js');
var parser = new xml2js.Parser();
var req = new XMLHttpRequest();
var req2= new XMLHttpRequest();

function search (keywords , nb1 ,nb2)
{
  var bubbles_number=0;
  var newMessage =new formatMess.Generic ;


  const msg=[
    {
      "type": 0,
      "speech": "Votre recherche <<" +keywords+">> ne correspond à aucun article :( \n.Essayez des termes plus généraux ou vérifiez l'orthographe -_-.\nVous pouvez également effectuer une nouvelle recherche ;)"
    }
  ]
      ;
  req.open('GET', myshoplink+"/api/search?query="+keywords+"%&language=1",false, key);
  req.send(null);

   var requet = req.responseText.toLowerCase();
  parser.parseString(requet,function(err,result)
  {

   var res=result.prestashop.products[0]["product"];
   if (!res)
   {
     console.log('no result pour'+keywords);

    }
     else
     {

       if (res.length>9)
       res= res.slice(0,10);
       res.forEach(function (r)
       {

         var link =r["$"]["xlink:href"];
         req2.open('GET',link,false, key);
         req2.send(null);
         var res2 = req2.responseText.toLowerCase();
         parser.parseString(res2,function(err,reslt2)
         {
           var info =reslt2.prestashop.product;
           var id =info[0]["id"][0];
           var price =info[0]["price"][0];
           var img=info[0]["id_default_image"]["0"]["$"]["xlink:href"];
           var des =info[0]["description_short"][0]["language"][0]["_"].replace(/<p>/gi, "").replace(/"/gi, "");
           var name=info[0]["name"][0]["language"][0]["_"];
           var idcat=info[0]["id_category_default"][0]["_"];
           var asso = info[0]["associations"][0]["accessories"][0]["product"];
           var productUrl = myshoplink +'/index.php?controller=product&id_product='+id;
             var prix =Math.round(price).toFixed(3);
             //console.log (nb1 , nb2);
          if ((!nb1 &&!nb2) || ((nb1&& nb2)&&(prix >= Math.round(nb1)) && (prix <=Math.round(nb2))) || (!nb2 && prix <= Math.round(nb1))   )
        {if (bubbles_number<9)
           {
             newMessage
            .addBubble( name , + prix +'DT \n'+ des. substring(0,65)+' ...')
            .addUrl(productUrl)
            .addImage(img+'?&ws_key='+key)
            .addButton('Acheter',   productUrl)
           .addButton('produits similaires',  "simi"+idcat )
           if (asso)
           { newMessage
             .addButton('Produits Recomandés', 'association'+id)
           }
           bubbles_number++;
          }}

        })
      })
     }


  })
//if (newMessage.template)
if (bubbles_number==0 )
return msg
newMessage
.get();

return  newMessage.template ;


}




function recherche (keywords ,callback )
{
  var bubbles_number=0;
  var newMessage =new formatMess.Generic ;


  const msg=[
    {
      "type": 0,
      "speech": "Votre recherche <<" +keywords+">> ne correspond à aucun article :( \n.Essayez des termes plus généraux ou vérifiez l'orthographe -_-.\nVous pouvez également effectuer une nouvelle recherche ;)"
    }
  ]
      ;
  req.open('GET', myshoplink+"/api/search?query="+keywords+"%&language=1",false, key);
  req.send(null);

   var requet = req.responseText.toLowerCase();
  parser.parseString(requet,function(err,result)
  {

   var res=result.prestashop.products[0]["product"];
   if (!res)
   {
     console.log('no result pour'+keywords);

    }
     else
   res.forEach(function (r)
   {

     var link =JSON.stringify(r["$"]["xlink:href"]) .replace(/"/gi, "");
     req2.open('GET',link,false, key);
     req2.send(null);
     var res2 = req2.responseText.toLowerCase();
     parser.parseString(res2,function(err,reslt2)
     {
       var info =reslt2.prestashop.product;
       var id =info[0]["id"][0];
       var price =info[0]["price"][0];
       var img=(JSON.stringify(info[0]["id_default_image"]["0"]["$"]["xlink:href"]).replace(/"/gi, ""));
       var des =info[0]["description_short"][0]["language"][0]["_"].replace(/<p>/gi, "").replace(/"/gi, "");
       var name=info[0]["name"][0]["language"][0]["_"];
       var idcat=info[0]["id_category_default"][0]["_"];
       var asso = info[0]["associations"][0]["accessories"][0]["product"];
      var productUrl = myshoplink +'/index.php?controller=product&id_product='+id;
       price = Math.round(price).toFixed(3)

      {if (bubbles_number<7)
       {
         newMessage
        .addBubble( name ,price + 'DT \n'+ des. substring(0,65)+' ...')
        .addUrl(productUrl)
        .addImage(img+'?&ws_key='+key)
        .addButton('Acheter',   productUrl)
       .addButton('produits similaires',  "simi"+idcat )
       if (asso)
       { newMessage
         .addButton('Produits Recomandés', 'association'+id)
       }

      }
       bubbles_number++;}
    })
  })

  })
//if (newMessage.template)
if (bubbles_number==0 )
callback (msg)
newMessage
.get();

callback  (newMessage.template) ;


}







function categories (idpere)
{
  var bubbles_number=0;
  var newMessage =new formatMess.Generic ;
  req.open('GET',myshoplink+ "/api/categories/"+idpere,false, key);
  req.send(null);
  var requet = req.responseText.toLowerCase();
  parser.parseString(requet,function(err,result){
  var res=result.prestashop["category"][0]["associations"][0]["categories"][0]["category"];
//  console.log(JSON.stringify(res));
//if (res)
  res.forEach(function (r)

    {
     var id = (r["id"][0])
     //console.log(id);
     var productUrl = myshoplink +'/index.php?controller=category&id_category='+id;
     var link =r["$"]["xlink:href"];
     req2.open('GET',link,false, key);
     req2.send(null);
     var res2 = req2.responseText.toLowerCase();
     parser.parseString(res2,function(err,reslt2)
      {
     var info =reslt2.prestashop.category;
     var des =info[0]["description"][0]["language"][0]["_"];
     var name=info[0]["name"][0]["language"][0]["_"];
     var img = myshoplink+ "/c/"+id+"-category_default/image.jpg"
     if(! des)
     {des='cette catégorie est jdjsfus dsfbla vla';}
   //console.log ( name,des );
   if (bubbles_number<9)
   {
     newMessage

    .addBubble( name ,des.substring(0,65).replace(/<p>/gi, "").replace(/<strong>/gi, "")+' ...')
    .addUrl(productUrl)
    .addImage(img)
    if (souscat(id))
    { newMessage
      .addButton('Sous Categories', 'Souscat'+id)
    }

    newMessage
    .addButton('Produits',  'Produit'+id )
    bubbles_number++;
  }

 })


 })
 newMessage
 .get();
//if (newMessage.template)
})
//console.log(newMessage.template);
return newMessage.template ;

}


function products(idcat)
{
  var bubbles_number=0;
  var newMessage =new formatMess.Generic ;
  req.open('GET',myshoplink+ "/api/categories/"+idcat,false, key);
  req.send(null);
  var requet = req.responseText.toLowerCase();
  parser.parseString(requet,function(err,result){
   var res=result.prestashop["category"][0]["associations"][0]["products"][0]["product"];
  //  console.log(JSON.stringify(res));

   if (!res)
   {
   } else
   res.forEach(function (r)
   {

     var link =JSON.stringify(r["$"]["xlink:href"]) .replace(/"/gi, "");
     req2.open('GET',link,false, key);
     req2.send(null);
     var res2 = req2.responseText.toLowerCase();
     parser.parseString(res2,function(err,reslt2)
     {
       var info =reslt2.prestashop.product;
       var id =info[0]["id"][0];
       var price =info[0]["price"][0];
       var img=(JSON.stringify(info[0]["id_default_image"]["0"]["$"]["xlink:href"]).replace(/"/gi, ""));
       var des =info[0]["description_short"][0]["language"][0]["_"].replace(/<p>/gi, "").replace(/<\/\p>/gi, "");
       var name=info[0]["name"][0]["language"][0]["_"];
       var idcat=info[0]["id_category_default"][0]["_"];
       var asso = info[0]["associations"][0]["accessories"][0]["product"];
      var productUrl = myshoplink +'/index.php?controller=product&id_product='+id;

       if (bubbles_number<9)
       {
         newMessage
        .addBubble( name ,Math.round(price).toFixed(3) + 'DT \n'+ des. substring(0,65)+' ...')
        .addUrl(productUrl)
        .addImage(img+'?&ws_key='+key)
        .addButton('Acheter',   productUrl)
       .addButton('produits similaires',  "simi"+idcat )
       if (asso)
       { newMessage
         .addButton('Produits Recomandés', 'association'+id)
       }

      }
    })
   bubbles_number++;
  })
  newMessage
  .get();
  })
  //if (newMessage.template)
  return newMessage.template ;








}




function souscat (id)
{
  req.open('GET',myshoplink+ "/api/categories/"+id,false, key);
  req.send(null);
  var requet = req.responseText.toLowerCase();
  var res ;
  parser.parseString(requet,function(err,result)
  {
  res=result.prestashop["category"][0]["associations"][0]["categories"][0]["category"];

})
if(! res )
return false;
return true;
}

 function prod_asso (id)
 {
  var res ;
  req.open('GET',myshoplink+ "/api/products/"+id,false, '96M36QV8GM45W9M9HS4PU1EFESNU7JM1');
  req.send(null);
  var requet = req.responseText.toLowerCase();
  parser.parseString(requet,function(err,result){
 res=result.prestashop.product[0]["associations"][0]["accessories"][0]["product"];
 console.log(res);
})
  if(! res )
  return false;
  return true;
 }

function association(idp)
{
  var newMessage =new formatMess.Generic ;
  var bubbles_number=0;
  req.open('GET',myshoplink+ "/api/products/"+idp,false, '96M36QV8GM45W9M9HS4PU1EFESNU7JM1');
  req.send(null);
  var requet = req.responseText.toLowerCase();
  parser.parseString(requet,function(err,result){
  var res=result.prestashop.product[0]["associations"][0]["accessories"][0]["product"];
  res.forEach(function (r)

    {
     var id = (r["id"][0]["_"])
     console.log(id);

     req2.open('GET',myshoplink+ "/api/products/"+id,false, '96M36QV8GM45W9M9HS4PU1EFESNU7JM1');
     req2.send(null);
     var res2 = req2.responseText.toLowerCase();
     parser.parseString(res2,function(err,reslt2)
      {
        var info =reslt2.prestashop.product;

        var price =info[0]["price"][0];
        var img=(JSON.stringify(info[0]["id_default_image"]["0"]["$"]["xlink:href"]).replace(/"/gi, ""));
        var des =info[0]["description_short"][0]["language"][0]["_"].replace(/<p>/gi, "").replace(/<\/\p>/gi, "");
        var name=info[0]["name"][0]["language"][0]["_"];
        var idcat=info[0]["id_category_default"][0]["_"];
        var productUrl = myshoplink +'/index.php?controller=product&id_product='+id;

        if (bubbles_number<9)
        {
          newMessage
         .addBubble( name ,Math.round(price).toFixed(3) + 'DT \n'+ des. substring(0,65)+' ...')
         .addUrl(productUrl)
         .addImage(img+'?&ws_key='+key)
         .addButton('Acheter',   productUrl)
        .addButton('produits similaires',  "simi"+idcat )
        if (prod_asso(id))
        { newMessage
          .addButton('Produits Recomandés', 'association'+id)
        }

       }
     })
    bubbles_number++;


 })
 newMessage
 .get();
})
return newMessage.template ;
}




module.exports ={
  search :  search,
  categories:categories,
  products:products,
  association:association,
  recherche:recherche
}
