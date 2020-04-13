function start(){
var right = 0 
document.querySelector("button").classList.add("lost") 
var length = 0
function fetching(){
        // console.log(length)
        fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
        .then(response => {
        return response.json();
        })
        .then(data =>{
        // console.log(data.results)
        var i =0
        if (length <5){
        play(data.results, i =0);
        }else{
        document.querySelector(".puzzle").classList.add("lost")
        // console.log("finished")
        document.querySelector(".announce").innerText = right
        document.querySelector(".result").classList.remove("lost")
        document.querySelector(".result").classList.add("notlost")
        }
        })
    }

function play(arr,x){
    array = arr[x]
    // console.log(array)
    document.querySelector(".question").innerText = array.question;
    document.querySelector(".answer").innerText = array.correct_answer; 
    a=Math.floor((Math.random())*4)
    q=(document.querySelectorAll(".a"))
    answer = array.correct_answer
    var c = 0
    for (var i=0 ; i<4; i++ ){
        if (i === a){
            document.querySelectorAll(".a")[i].innerText =array.correct_answer
        }else {
            document.querySelectorAll(".a")[i].innerText = array.incorrect_answers[c]
            c +=1
        }
    }
}
    fetching()
    var divisions = document.querySelectorAll(".a")
    divisions.forEach(div =>{
        div.addEventListener('click',() => {
            if (div.innerText === document.querySelector(".answer").innerText){
                console.log("right")
                right +=1
                length+=1
                fetching()
            }else{
                console.log("wrong")
                length+=1
                fetching()
            }
        })
    })

}


    
