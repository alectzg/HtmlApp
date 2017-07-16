(() => {
	$("#test").on("click", () => {
		let scriptVal = $("#myscript").val();
		let func = new Function(scriptVal);
		func.call();
	});

	$("#saveScript").on("click", () => {
		let val = $("#myscript").val();

		if (val.replace(/^\s+|\s+$/g, "").length > 0) {
			// console.log("value: ", val);
			$.post("canval_SaveScript", {
				data: val
			}).done((data) => {
				console.log(data);
			}).fail((err) => {
				alert(err);
			}).always(() => {
				console.log("ajax finish!!");
			});
		} else {
			alert("value was null!!");
		}
	});

	$("#clearCanvas").on("click", () => {
		let canvas = $("#myCanvas")[0];
		let ctx = canvas.getContext("2d");
		// ctx.fillStyle = "rgb(0,0,0)";
		// ctx.fillRect(0, 0, canvas.width, canvas.height);
		canvas.height = canvas.height;
		console.log("clear canvas!!", canvas.width, canvas.height);
	});
})();