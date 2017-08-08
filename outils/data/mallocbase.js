// impotrs
var firebase = require('firebase');

//configuration

var config = {
   apiKey: "AIzaSyCBJemKzhTL3rHli-Z353eBhf20aNHYtfY",
   authDomain: "mallocbot.firebaseapp.com",
   databaseURL: "https://mallocbot.firebaseio.com",
   projectId: "mallocbot",
   storageBucket: "mallocbot.appspot.com",
   messagingSenderId: "702821196607"
 };

 // intialisation et connection

 firebase.initializeApp(config);
 var mallocdata = firebase.database();


 // ajout des information


 //ajout un utilisateur la premiere fois

 function ajout (id ,infos)
 {

   mallocdata.ref('info/user/'+id+'/fb/').set(infos)
   .then((okay)=>{if (!okay) console.log('les informations de l utilisateur '+id+ 'est ajoutés à la base');})
   .catch((erreur)=>{console.log ('il ya un erreur l utilisateur n est pas ajouté à la base ');
                      console.log(erreur);
                    });

 }


 function mise_a_jour (id , motcle)

 {
   updates=[]
   mallocdata.ref('info/user/'+id+'/fb/').set(motcle)
   .then((okay)=>{if (!okay) console.log('l histrique est mis à jour '+id);})
   .catch((erreur)=>{console.log ('il ya un erreur à la mise à jour ');
                      console.log(erreur);
                    });


 }

 function recherche_data (id ,motcle)
 {
   var ref= mallocdata.ref('info/user/'+id+'/recherche');
   exist(ref,motcle).then((existe)=>
   {if (existe)
      {
        ref.once("value")
        .then(function(mots) {
        var mot= mots.child(motcle).val() ;
        mot.nb ++ ;
        mallocdata.ref('info/user/'+id+'/recherche/'+motcle+"/").update(mot);
        console.log ('recherche existe enregistré');});
      }
      else {
        var mot= {
          nb : 1
        }
      mallocdata.ref('info/user/'+id+'/recherche/'+motcle+"/").set(mot);
        console.log ('nouvelle recherche');
      }
    })
};

function extractData ()
{

  var ref= mallocdata.ref('info/user/');
  return new Promise((resolve, reject) =>
 {
  ref.once("value")
    .then(function(data) {
       resolve(data.val());
  })
})
}

function exist (ref ,enfant)
{

  return new Promise((resolve, reject) =>
 {
   ref.once("value")
  .then(function(snapshot )
  {
    if (snapshot.hasChild(enfant))
      {resolve(true);}
    else
      {resolve(false);}

  });
})

}


 module.exports =
 {
   ajout:ajout,
   mise_a_jour:mise_a_jour,
   recherche_data:recherche_data,
   extractData:extractData
 }
