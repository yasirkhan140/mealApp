
// get element from the html document.
var searchBtn = document.getElementById("search-btn");
var mealList = document.getElementById("meal-show-container");
var closeBtn = document.getElementById("close-btn");
var renderRecipeDetail =document.getElementById("show-recipe-container");
var showRecipePage = document.getElementById("show-recipe");
var backBtn = document.getElementById("back-btn");
var favPage = document.getElementById("show-fav-page");
var mainPage = document.getElementById("container-main");
var viewFavBtn = document.getElementById("view-fav-btn");
var getRecipeBtn = document.getElementsByClassName("get-recipe-btn");
var favBtn = document.getElementsByClassName("fav-btn")
var deleteBtn = document.getElementsByClassName("remove-fav-btn");
var showFavMeal = document.getElementById("show-fav-list");
Console.log("linked script.js");

// add event listener to search btn click and call getMeal function
searchBtn.addEventListener('click', getMeal);
// function to get the meal item from api 
function getMeal(){
    let searchText = document.getElementById("search-input").value.trim();
    // show-fav-pagefetch the data from api db
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+searchText)
    // response 
    .then(response=>response.json())
    // data came from api
    .then(data=>{
        let html = "";
        // if data.meals found in api
        if(data.meals){
           data.meals.forEach(e => {
            // html element to render with data for each meal.
            let getFavID = JSON.parse(localStorage.getItem("favID"));
            let btn = '';
            if(getFavID!=null){
                for(var i=0;i<getFavID.length;i++){
                    if(e.idMeal==getFavID[i]){
                        btn='';
                        break;
                    }else{
                        btn= '\n\
                        <button type = "sumbit" class ="fav-btn" id ='+e.idMeal+'> \n\
                            <i class="fa-sharp fa-solid fa-heart" ></i> \n\
                        </button> \n\
                        '
                    }
                }
            }else{
                btn= '\n\
                <button type = "sumbit" class ="fav-btn" id ='+e.idMeal+'> \n\
                    <i class="fa-sharp fa-solid fa-heart" ></i> \n\
                </button> \n\
                '
            }
                html += '\n\
                <div class = "meal-container">\n\
                    <img src= '+e.strMealThumb+' alt="dish" id  = "meal-img"> \n\
                    <h3 id  ="meal-name">'+e.strMeal+'</h3> \n\
                    '+btn+'\n\
                    <button type = "" class ="get-recipe-btn" id ='+e.idMeal+'>  \n\
                        get recipe \n\
                    </button> \n\
            </div>';
           });
           
        }
        
        // if data is not found in api.
        if(data.meals==null){
            html +='<h1 class = "text"> No result Found</h1>'
        }
        // render the html in meal container
        mealList.innerHTML= html;  

        // add a click event to recipe btn call the function with call getRecipe with argument button tag(id).
        // same for fav btn and call the function addFav 
               
        for(var i =0;i<getRecipeBtn.length;i++){
            getRecipeBtn[i].addEventListener("click",function(){ 
                getRecipe(this)
            });
            
        }
        for(var i =0;i<favBtn.length;i++){
            // on click fav btn call addFav function with argument button tag (id){for extract the meal id of clicked btn}
            favBtn[i].addEventListener("click",function(){
                addFav(this);
            }) 
        }
         
           
    })
}



// function to add meal in fav list 
function addFav(event){
    
    
    let getMealId = event.id.trim();
    // add a fav meal id to array 
    
    
    // if localstrege not have a data
    if(localStorage.getItem("favID")==null){
        localStorage.setItem("favID",'[]');
    }
    // get old data from localStorage and push new data to it.
    var old_data = JSON.parse(localStorage.getItem("favID"));
    old_data.push(getMealId);
    // store the all data to localstorge
    localStorage.setItem("favID",JSON.stringify(old_data));

    
    
     
}

// onclick close btn of recipe page
closeBtn.onclick=function(){
    showRecipePage.style.display="none"
}

// on click the back on fav page 
backBtn.onclick=function(){
    favPage.style.display="none";
    mainPage.style.display= "block";

}

// on click the view fav btn to view page
viewFavBtn.addEventListener("click",function(){
    viewFavPage()
})
function viewFavPage(){
    mainPage.style.display="none";
    favPage.style.display="block";
    var getFavID = JSON.parse(localStorage.getItem("favID"));
    let html = "";
    if(getFavID!=null){
        for(var i = 0;i<getFavID.length;i++){
            fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+getFavID[i])
            // response
            .then(response=>response.json())
            // data came from api
            .then(data=>{
            
                
                if(data.meals){
                    data.meals.forEach(meal=>{
                        html+='\n\
                        <div class = "meal-container">\n\
                            <img src= '+meal.strMealThumb+' alt="dish" id  = "meal-img"> \n\
                            <h3 id  ="meal-name">'+meal.strMeal+'</h3> \n\
                                <button type = "sumbit" class ="remove-fav-btn"id ='+meal.idMeal+'>\n\
                                    <i class="fa fa-trash" ></i>\n\
                                </button>\n\
                            <button type = "" class ="get-recipe-btn" id ='+meal.idMeal+'>  \n\
                                get recipe \n\
                            </button> \n\
                        </div>';
                    })
                    
                }
                showFavMeal.innerHTML=html 
                
                
                // add event listerner to delete btn in fav page
                // on click the delte btn in fav page 
                for(var i=0;i<deleteBtn.length;i++){
                    deleteBtn[i].addEventListener("click",function(){
                        deleteFavMeal(this);
                    })
                }
                // get recipe btn in fav page add listerner to view a recipe page
                for(var i =0;i<getRecipeBtn.length;i++){
                    
                    getRecipeBtn[i].addEventListener("click",function(){ 
                        getRecipe(this)
                    });
                }                
            })  
        }
    }
    showFavMeal.innerHTML='<h1 class = "text-white"> No favorite meal</h1>';
       
    
    
}

// function to remove fav meal from fav meal page 
function deleteFavMeal(event){
    // get the id of meal
    let getMealId= event.id.trim();
    // get the data from localstorge 
    var getFavID = JSON.parse(localStorage.getItem("favID"));
    console.log(getFavID);
    // remove the all data from local stroage
    localStorage.removeItem("favID");
    // check for the meal is present in the fav page.
        for(var i=0;i<getFavID.length;i++){
            // if present to do noting
        if(getFavID[i]==getMealId){
            console.log("yes")
            // if not then store the all again to local stroge
        }else{
            // localstorge is not present
            if(localStorage.getItem("favID")==null){
                localStorage.setItem("favID",'[]');
            }
            // get old data from localStorage and push new data to it.
            var old_data = JSON.parse(localStorage.getItem("favID"));
            old_data.push(getFavID[i]);
            // store the all data to localstorge
            localStorage.setItem("favID",JSON.stringify(old_data));
            // call the function again to view the fav page.
            viewFavPage();
        }
    }
}

// function to get the recuipe page to view extra more
function getRecipe(event){
    showRecipePage.style.display="block";
    console.log(event);
    // get the id of meal from html id of button which is clicked
    let getMealId= event.id.trim();
    // fetch the data from the api by id
    fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+getMealId)
    // response
    .then(response=>response.json())
    // data came from api
    .then(data=>{
        let renderHtml = "";
        if(data.meals){
            // meal data array [0]
            let meal= data.meals[0];
            // update the html with data of recipe
            renderHtml+=' \n\
            <div id ="recipe-heading-cont"> \n\
            <h2 id = "recipe-name" class ="text-white"> '+meal.strMeal+'</h2> \n\
            <h4 id = "category-name" class ="text-white">'+meal.strCategory+'</h4> \n\
            <h4 id ="area-name" class = "text-white">'+meal.strArea+'</h4>\n\
            <h2 id = "instructions-heading"class ="text-white">Instructions:</h2> \n\
            </div> \n\
            <div id ="para-instruction"> \n\
                <p id  ="recipe-instruction" class ="text-white"> '+meal.strInstructions+'</p> \n\
            </div>\n\
            <div> \n\
                <a href  ='+meal.strYoutube+' id ="youtube-link" class ="text-white"> \n\
                    <img src ='+meal.strMealThumb+' alt = "logo"/> \n\
                    <p>Click here to watch video</p> \n\
                </a> \n\
            </div> \n\
        ';
}
        // render the html in recipie page with data.
        renderRecipeDetail.innerHTML= renderHtml;
        

    })
    
}



