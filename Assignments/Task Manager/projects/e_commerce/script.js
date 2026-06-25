const createProduct = document.querySelector(".createProduct");
const overlay = document.querySelector(".overlay");
const form = document.querySelector("#form");
const productSection = document.querySelector(".productSection");

const closeOverlay = document.querySelector(".closeOverlay h1");
const createTag = document.querySelector("#createTag");
const createBtn = document.querySelector("#createBtn");

const deleteBtn = document.querySelector(".deleteBtn");

let updateIndex = null;
let deleteIndex = null;

let productArr = JSON.parse(localStorage.getItem("Products")) || [];

createProduct.addEventListener("click", () => {
  overlay.style.display = "flex";
  form[0].value = '';
  form[1].value = '';
  form[2].value = '';
  form[3].value = '';
});

closeOverlay.addEventListener("click", () => {
  overlay.style.display = "none";
  createTag.textContent = "Create Product";
  createBtn.textContent = "Create";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e, "submit successful");

  createTag.textContent = "Create Product";
  createBtn.textContent = "Create";

  const name = e.target[0].value;
  const description = e.target[1].value;
  const price = e.target[2].value;
  const url = e.target[3].value;

  if (
    name.trim() == "" ||
    description.trim() == "" ||
    price.trim() == "" ||
    url.trim() == ""
  ) {
    alert("please fill values");
    return;
  }

  const productObj = {
    name: name,
    description: description,
    price: price,
    url: url,
  };

  if (updateIndex !== null) {
    productArr[updateIndex] = productObj;
    localStorage.setItem("Products", JSON.stringify(productArr));
    e.target[0].value = "";
    updateIndex = null;
  } else {
    productArr.push(productObj);
    localStorage.setItem("Products", JSON.stringify(productArr));
  }

  overlay.style.display = "none";
  productSection.textContent = "";
  renderUi();


});

const renderUi = () => {

  productArr.forEach((val) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `  <img src=${val.url} alt="">
        <div class="info">
        <h3 id="name">${val.name}</h3>
        <h2 id="description">${val.description}</h2>
        <h2 id="price">${val.price}</h2>
        </div>
        <div class="cardBtns">
        <button onClick="updateData('${val.name}')" id="updateBtn" class="updateBtn">Update</button>
        <button onClick="deleteData('${val.name}')" id="deleteBtn" class="deleteBtn">Delete</button>
        </div>`;

    productSection.appendChild(card);
  });
};
renderUi();

const updateData = (name) => {
  overlay.style.display = "flex";
  createTag.textContent = "Update Product";
  createBtn.textContent = "Update";

  let product = productArr.find((elem) => elem.name === name);
  updateIndex = productArr.findIndex((elem) => elem.name === name);
  console.log("update index", updateIndex);

  form[0].value = product.name;
  form[1].value = product.description;
  form[2].value = product.price;
  form[3].value = product.url;
};

const deleteData = (name) => {
  let product = productArr.find((elem) => elem.name === name);
  deleteIndex = productArr.findIndex((elem) => elem.name === name);
  console.log("delete index", deleteIndex);

  if (deleteIndex != null) {
    console.log(productArr);
    productArr.splice(deleteIndex, 1);
    localStorage.setItem("Products", JSON.stringify(productArr));
    deleteIndex = null;
  }

  productSection.textContent = "";
  renderUi();
};
