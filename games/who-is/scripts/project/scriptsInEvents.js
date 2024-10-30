function hexToRgb(hex) {
  var result={r:0,b:0,g:0}
  if(hex){
  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  } 
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : {r:0,b:0,g:0};
}

var ad1 = null;
window.showAd1 = function(){
	destroyAd1();
	ad1 = document.createElement('div');
    // we make it ignore any standard positioning
	ad1.style.position = 'absolute';
	ad1.setAttribute('id', 'q7');	
	// position it here, 50% is in the center
	ad1.style.left = '50%';
	// 25% is close to the bottom
	ad1.style.bottom = '0%';
	// potential padding
	ad1.style.paddingBottom = '0px';
	// put the pivot of the ad in the center
	ad1.style.transform = 'translate(-50%, -50%)';
	document.body.appendChild(ad1);
	PokiSDK.displayAd(ad1, '728x90');
}
window.showAd2 = function(){
	destroyAd1();
	ad1 = document.createElement('div');
    // we make it ignore any standard positioning
	ad1.style.position = 'absolute';
	ad1.setAttribute('id', 'q7');
	// position it here, 50% is in the center
	ad1.style.left = '50%';
	// 25% is close to the bottom
	ad1.style.bottom = '33%';
	ad1.style.marginTop = "0";
	// potential padding
	ad1.style.paddingBottom = '2px';
	// put the pivot of the ad in the center
	ad1.style.transform = 'translate(-50%, -50%)';	
	document.body.appendChild(ad1);
	PokiSDK.displayAd(ad1, '320x50');
}

window.showAd3 = function(){
	destroyAd1();
	ad1 = document.createElement('div');
    // we make it ignore any standard positioning
	ad1.style.position = 'absolute';
	ad1.setAttribute('id', 'q7');
	// position it here, 50% is in the center
	ad1.style.left = '50%';
	// 25% is close to the bottom
	ad1.style.bottom = "0";
     ad1.style.marginTop = "-20%";
	// potential padding
	ad1.style.paddingBottom = '2px';
	// put the pivot of the ad in the center
	ad1.style.transform = 'translate(-50%, -50%)';	
	document.body.appendChild(ad1);
	PokiSDK.displayAd(ad1, '320x50');
}


window.setPositionLandscape=function(){
	if(ad1){
	 ad1.style.bottom = "0";
     ad1.style.marginTop = "-20%";
	}
}

window.setPositionPortrait=function(){
	if(ad1){
	ad1.style.bottom = "33%";
	ad1.style.marginTop = "0";
	}
}

window.destroyAd1 = function(){
	if(ad1){
		PokiSDK.destroyAd(ad1);
		ad1 = null;
	}
}


const scriptsInEvents = {

	async Globale_Event9_Act2(runtime, localVars)
	{
		  PokiSDK.commercialBreak()
		   .then(() => {
		   PokiSDK.gameplayStart();
		   });
	},

	async Globale_Event12_Act1(runtime, localVars)
	{
		runtime.setReturnValue(hexToRgb(localVars.hex).g);
	},

	async Globale_Event13_Act1(runtime, localVars)
	{
		runtime.setReturnValue(hexToRgb(localVars.hex).r);
	},

	async Globale_Event14_Act1(runtime, localVars)
	{
		runtime.setReturnValue(hexToRgb(localVars.hex).b);
	},

	async Globale_Event26_Act1(runtime, localVars)
	{
		window.showAd2();
	},

	async Globale_Event27_Act1(runtime, localVars)
	{
		window.showAd3();
	},

	async Globale_Event29_Act1(runtime, localVars)
	{
		window.showAd3();
		
	},

	async Globale_Event30_Act1(runtime, localVars)
	{
		window.showAd1();
	},

	async Globale_Event36_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
	},

	async Globale_Event36_Act2(runtime, localVars)
	{
		window.destroyAd1();
	},

	async Globale_Event111_Act3(runtime, localVars)
	{
		  PokiSDK.commercialBreak()
		   .then(() => {
		   runtime.callFunction("pokiCommercial"); 
		   runtime.callFunction("unpauseGame");
		   PokiSDK.gameplayStart();
		   });
	},

	async Globale_Event113_Act3(runtime, localVars)
	{
		  PokiSDK.commercialBreak()
		   .then(() => {
		   runtime.callFunction("pokiCommercial"); 
		   runtime.callFunction("unpauseGame");
		   PokiSDK.gameplayStart();
		   });
	},

	async Globale_Event114_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
	},

	async Globale_Event114_Act2(runtime, localVars)
	{
		PokiSDK.customEvent('Who is', 'level_end', { segment: ''+runtime.globalVars.level });
	},

	async Globale_Event116_Act1(runtime, localVars)
	{
		window.destroyAd1();
	},

	async Globale_Event118_Act1(runtime, localVars)
	{
		PokiSDK.customEvent('Who is', 'level_start', { segment: ''+runtime.globalVars.level });
	},

	async Globale_Event119_Act3(runtime, localVars)
	{
		 PokiSDK.rewardedBreak().then(
		 
		        (withReward) => {
		            if(withReward){
		               
		                //resume game
						runtime.callFunction("rewardedSuccessful");
						runtime.callFunction("pokiCommercial");
						runtime.callFunction("unpauseGame");
						PokiSDK.gameplayStart();
		            }else{
					runtime.callFunction("pokiCommercial");
					runtime.callFunction("unpauseGame");
					PokiSDK.gameplayStart();
					}
		        }
		
		    )
	},

	async Globale_Event128_Act2(runtime, localVars)
	{
		 PokiSDK.rewardedBreak().then(
		 
		        (withReward) => {
		            if(withReward){
		               
		                //resume game
						runtime.callFunction("rewardedSuccessful");
						PokiSDK.gameplayStart();
		            }else{
					runtime.callFunction("unpauseGame");
					PokiSDK.gameplayStart();
					}
		        }
		
		    )
	},

	async Globale_Event129_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
	},

	async Globale_Event133_Act2(runtime, localVars)
	{
		 PokiSDK.rewardedBreak().then(
		 
		        (withReward) => {
		            if(withReward){
		               
		                //resume game
						runtime.callFunction("rewardedSuccessful");
						PokiSDK.gameplayStart();
		            }else{
					runtime.callFunction("unpauseGame");
					PokiSDK.gameplayStart();
					}
		        }
		
		    )
	},

	async Starte_Event1_Act2(runtime, localVars)
	{
		PokiSDK.init();
	},

	async Levelselecte_Event20_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStart();
	},

	async Levelselecte_Event21_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStart();
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

