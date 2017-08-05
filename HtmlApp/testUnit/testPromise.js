function animation(domEle, endPos, step) {

  let currPos = domEle.style.marginLeft;
  return new Promise(function(resolve, reject) {
    setTimeout(76, function() {
      if (currPos < endPos) {
        currPos = curPos + step;
        domEle.style.marginLeft = currPos;
      }
    });
  });
}


function animation(domEle, endPos, step) {
  let currPos = domEle.style.marginLeft;

  function exec() {
    setTimeout(76, () => {
      if (currPos < endPos) {
        currPos += step;
        currPos = (currPos > endPos ? endPos : currPos);
        domEle.style.marginLeft = currPos;
        exec();
      } else {
        console.log("clear~~~");
      }
    })
  }
  exec();
}

var ball1 = document.getElemnetById("ball-red");
animation(ball1, 300, 10)


function test() {
  return new Promise((resolve, reject) => {
    var num = Math.ceil(Math.random() * 10);
    if (num < 5) reject();
    else resolve();
  });
}

test.then(() => {
  console.log("success");
}, () => {
  console.log("random fail!!")
});