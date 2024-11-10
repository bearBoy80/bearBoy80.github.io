


const scriptsInEvents = {

	async Background_Event4_Act1(runtime, localVars)
	{
		 document.body.style.backgroundColor = "#ffffff";
	},

	async Background_Event6_Act1(runtime, localVars)
	{
		document.body.style.background = `-webkit-linear-gradient(top, #fff, #000)`;
	},

	async Background_Event9_Act1(runtime, localVars)
	{
		function myFunction() {
		  document.body.style.backgroundColor = "#f3A3A3";
		  document.body.style.backgroundImage = "url('giphy.gif')";
		}
		
		myFunction();
	},

	async Background_Event10_Act1(runtime, localVars)
	{
		function myFunction() {
		  document.body.style.backgroundColor = "#f3A3f3";
		  document.body.style.backgroundImage = "url('https://static.remove.bg/remove-bg-web/6cc620ebfb5922c21227f533a09d892abd65defa/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png')";
		}
		
		myFunction();
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

