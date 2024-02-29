const imageWrapper = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.gallery .load-more');
const searchInput = document.querySelector('.search input');
const lightbox = document.querySelector('.lightbox');
const closeBtn = lightbox.querySelector('.uil-times');
const downloadImgBtn = lightbox.querySelector(".uil-import")

const apiKey = "5cqWFew6iCniG26nR3ubIFawXXEkD1M2djbHCa779a05XsEHjIZhaqnv";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

//  getting  ImageURL from generateHTML to downloadImage
const downloadImg = (imgURL) => {
// console.log(imgURL);
// converting received img into blob , creating download link, and downloading it.
    fetch(imgURL)
    .then(res => res.blob())
    .then(blob => {
        console.log(blob);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = new Date().getTime();
        a.click()
    })
    .catch(() => alert('Failed to download image!'));
}

const showLightbox = (name, img) => {

    lightbox.querySelector('img').src = img;
    lightbox.querySelector('span').innerText = name;
    // storing imgURL as button attribute
    downloadImgBtn.setAttribute("data-img", img);
    lightbox.classList.add('show');
    // hide scrollbar while preveiw of image
    document.body.style.overflow = 'hidden' ;
}

const hideLightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = 'auto' ;
}

// displaying required details from the data of the API
const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map(img => 
     ` <li class="card" onclick="showLightbox('${img.photographer}' , '${img.src.large2x}')" >
           <img src="${img.src.large2x}" alt="img" >
           <div class="details">
                <div class="photographer">
                     <i class="uil uil-camera"></i>
                     <span>${img.photographer}</span>
                </div>                
                <button onclick="downloadImg('${img.src.large2x}'); event.stopPropagation();"> 
                    <i class="uil uil-import"></i>
                </button>
          </div>
        </li>`
        
        ).join('');
}

// fetching data from api
const getImages = (apiURL) => {

loadMoreBtn.innerText = 'Loading...';
loadMoreBtn.classList.add('disabled');

    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        // console.log(data);
        generateHTML(data.photos)
        loadMoreBtn.innerText = 'Load More';
        loadMoreBtn.classList.remove('disabled');
    })
    .catch(() => alert('Failed to load images!'));
}

// Loader
const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    // loadImages as per searchTern
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL ;
     getImages(apiURL);
}

// Implementing Search functionality
const loadSearchImages = (e) => {
    if(e.target.value === "") return searchTerm = null ;
   if(e.key === 'Enter'){
   currentPage = 1;
    searchTerm = e.target.value ;
    imagesWrapper.innerHTML = "";
    // using search api url 
    // "https://api.pexels.com/v1/search?query=nature&per_page=1"
    getImages( `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` )
   }
}

// Passing imageURL
getImages( `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);


// EventListners
loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
//passing img attribute value from showlightbox function to downloadImg function.
downloadImgBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img));