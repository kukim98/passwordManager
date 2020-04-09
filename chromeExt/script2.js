  var regularRecommendation = document.getElementById("regularRec");
  let specialNum = parseInt(document.getElementById("specialInput").value);
  let numNum = parseInt(document.getElementById("numberInput").value);
  let capitalNum = parseInt(document.getElementById("capitalInput").value);
  let lengthNum = parseInt(document.getElementById("lengthInput").value);
  let lowerNum = lengthNum - capitalNum - numNum - specialNum;
  if(specialNum + numNum + capitalNum > lengthNum){
    regularRecommendation.innerHTML = "Password length must be less than or equal to\nthe sum of the three criteria.";
  }else{
    var stringRec = "";
    for(let i = 0; i < lengthNum; i++){
      let decider = Math.floor(Math.random() * 4);
      if(decider == 0 && specialNum > 0){
        var symbols = '~!@#$%^&*()_+=-][{};:/?.,`';
        let ran = symbols.charAt(Math.floor(Math.random() * symbols.length));
        stringRec = stringRec.concat(ran);
        specialNum--;
      }else if(decider == 1 && numNum > 0){
        var numbers = '0192837465';
        let ran = numbers.charAt(Math.floor(Math.random() * numbers.length));
        stringRec = stringRec.concat(ran);
        numNum--;
      }else if(decider == 2 && capitalNum > 0){
        var capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let ran = capitals.charAt(Math.floor(Math.random() * capitals.length));
        stringRec = stringRec.concat(ran);
        capitalNum--;
      }else if(lowerNum > 0){
        var lowers = 'abcdefghijklmnopqrstuvwxyz';
        let ran = lowers.charAt(Math.floor(Math.random() * lowers.length));
        stringRec = stringRec.concat(ran);
        lowerNum--;
      }else{
        i--;
      }
    }
    regularRecommendation.innerHTML = stringRec;
  }
