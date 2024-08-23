const books = [];
const TAMPIL_DATA = "tampil_buku";
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("inputBook").addEventListener("submit", function (e) {
    e.preventDefault();
    tambahBuku();
    resetForm();
  });

  if (tersediaStorage()) {
    loadDataBukuFromStorage();
  }
});

function resetForm() {
  document.getElementById("inputBook").reset();
  document.getElementsByClassName("input_inline")[0].style.display = "block";
  document.getElementById("bookSubmit").style.display = "inline-block";
}

document.addEventListener(TAMPIL_DATA, function (e) {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  incompleteBookshelfList.innerHTML = "";
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  completeBookshelfList.innerHTML = "";
  console.log(books);
  for (data of books) {
    const elementBuku = buatElementBuku(data);
    if (data.isComplete) {
      completeBookshelfList.append(elementBuku);
    } else {
      incompleteBookshelfList.append(elementBuku);
    }
  }
});

function tambahBuku() {
  const judul = document.getElementById("inputBookTitle").value;
  const penulis = document.getElementById("inputBookAuthor").value;
  const tahun = parseInt(document.getElementById("inputBookYear").value);
  const kondisi = document.getElementById("inputBookIsComplete").checked;
  const idUnik = generateId();
  const dataBuku = objectBuku(idUnik, judul, penulis, tahun, kondisi);
  books.push(dataBuku);
  document.dispatchEvent(new Event(TAMPIL_DATA));
  simpanBuku();
}

function objectBuku(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function generateId() {
  return +new Date();
}

function buatElementBuku(buku) {
  const judul = document.createElement("h3");
  judul.innerText = buku.title;
  const penulis = document.createElement("p");
  penulis.innerText = buku.author;
  const tahun = document.createElement("p");
  tahun.innerText = buku.year;

  const action = document.createElement("div");
  action.classList.add("action");
  const buttonGreen = document.createElement("button");
  buttonGreen.classList.add("green");
  const buttonRed = document.createElement("button");
  buttonRed.classList.add("red");
  buttonRed.innerText = "Hapus buku";
  buttonRed.addEventListener("click", function () {
    // const cekConfirm = confirm("Hapus Data? ");
    // if (cekConfirm) {
    //   hapusDataBuku(buku.id);
    // }
    customRemoveDialog(buku.id);
  });
  // Tombol Edit
  const buttonYellow = document.createElement("button");
  buttonYellow.classList.add("yellow");
  buttonYellow.innerText = "Edit Buku";
  let angka = 1;
  buttonYellow.addEventListener("click", function () {
    if (angka == 1) {
      buttonGreen.style.display = "none";
      buttonRed.style.display = "none";
      buttonYellow.style.backgroundColor = "green";
      buttonYellow.style.color = "#fff";
      buttonYellow.innerText = "Simpan";
      editDataBuku(buku.id, angka);
      document.getElementsByClassName("input_inline")[0].style.display = "none";
      document.getElementById("bookSubmit").style.display = "none";
      angka = 2;
    } else {
      editDataBuku(buku.id, angka);
      document.getElementsByClassName("input_inline")[0].style.display = "block";
      document.getElementById("bookSubmit").style.display = "inline-block";
      buttonGreen.style.display = "inline-block";
      buttonRed.style.display = "inline-block";
      angka = 1;
    }
  });

  if (buku.isComplete) {
    buttonGreen.innerText = "Belum selesai di Baca";
    buttonGreen.addEventListener("click", function () {
      pindahBelumDibaca(buku.id);
    });
  } else {
    buttonGreen.innerText = "Selesai dibaca";
    buttonGreen.addEventListener("click", function () {
      pindahSelesaiDibaca(buku.id);
    });
  }

  action.append(buttonGreen, buttonRed, buttonYellow);

  const article = document.createElement("article");
  article.setAttribute("data-id", buku.id);
  article.classList.add("book_item");
  article.append(judul, penulis, tahun, action);

  return article;
}

function pindahSelesaiDibaca(idBuku) {
  const dataBuku = cariDataBuku(idBuku);
  if (dataBuku != null) {
    dataBuku.isComplete = true;
    document.dispatchEvent(new Event(TAMPIL_DATA));
    simpanBuku();
  }
}

function pindahBelumDibaca(idBuku) {
  const dataBuku = cariDataBuku(idBuku);
  if (dataBuku != null) {
    dataBuku.isComplete = false;
    document.dispatchEvent(new Event(TAMPIL_DATA));
    simpanBuku();
  }
}

function cariDataBuku(idBuku) {
  for (const data of books) {
    if (data.id === idBuku) {
      return data;
    }
  }
  return null;
}

function hapusDataBuku(idBuku) {
  const indexBuku = cariIndexBuku(idBuku);
  if (indexBuku === -1) return;

  books.splice(indexBuku, 1);
  document.dispatchEvent(new Event(TAMPIL_DATA));
  simpanBuku();
}

function cariIndexBuku(idBuku) {
  for (i in books) {
    if (books[i].id === idBuku) {
      return i;
    }
  }
  return -1;
}

// FITUR WEB STORAGE
const SAVE_BUKU_EVENT = "save_buku";
const KUNCI_STORAGE = "BOOKS_APPS";

function simpanBuku() {
  if (tersediaStorage()) {
    const parseBuku = JSON.stringify(books);
    localStorage.setItem(KUNCI_STORAGE, parseBuku);
    document.dispatchEvent(new Event(SAVE_BUKU_EVENT));
  }
}

function tersediaStorage() {
  if (typeof Storage === undefined) {
    alert("Maaf Web browser tidak mendukung");
    return false;
  }
  return true;
}

document.addEventListener(SAVE_BUKU_EVENT, function () {
  console.log(localStorage.getItem(KUNCI_STORAGE));
});

function loadDataBukuFromStorage() {
  const parseDataBuku = localStorage.getItem(KUNCI_STORAGE);
  let data = JSON.parse(parseDataBuku);
  if (data !== null) {
    for (const i of data) {
      books.push(i);
    }
  }
  document.dispatchEvent(new Event(TAMPIL_DATA));
}
// AKHIR FITUR WEB STORAGE

// FITUR CUSTOM DIALOG
function customRemoveDialog(idBuku) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      hapusDataBuku(idBuku);
      Swal.fire({
        title: "Deleted!",
        text: "Your book has been deleted.",
        icon: "success",
      });
    }
  });
}

// FITUR EDIT DATA BUKU
// Cara Kerja :
// Klik tombol edit, lalu ubah datanya di form, kemudian klik tombol edit lagi untuk mengubah datanya
function editDataBuku(idBuku, angka) {
  const dataBuku = cariDataBuku(idBuku);
  if (angka == 1) {
    document.getElementById("inputBookTitle").value = dataBuku.title;
    document.getElementById("inputBookAuthor").value = dataBuku.author;
    document.getElementById("inputBookYear").value = dataBuku.year;
    let article = document.getElementsByClassName("book_item");
    for (i of article) {
      if (i.dataset.id != idBuku) {
        i.style.display = "none";
      }
    }
  } else {
    const judul = document.getElementById("inputBookTitle").value;
    const penulis = document.getElementById("inputBookAuthor").value;
    const tahun = parseInt(document.getElementById("inputBookYear").value);
    dataBuku.title = judul;
    dataBuku.author = penulis;
    dataBuku.year = tahun;
    simpanBuku();
    resetForm();
    document.dispatchEvent(new Event(TAMPIL_DATA));
  }
}
// AKHIR FITUR EDIT DATA BUKU

// FITUR PENCARIAN BUKU
let dataPencarian = [];
const TAMPIL_DATA_PENCARIAN = "tampil_pencarian_buku";

document.addEventListener(TAMPIL_DATA_PENCARIAN, function () {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  incompleteBookshelfList.innerHTML = "";
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  completeBookshelfList.innerHTML = "";

  for (const data of dataPencarian) {
    const elementBuku = buatElementBuku(data);
    if (data.isComplete) {
      completeBookshelfList.append(elementBuku);
    } else {
      incompleteBookshelfList.append(elementBuku);
    }
  }
  dataPencarian = [];
});

document.getElementById("searchBook").addEventListener("submit", function (e) {
  const cariJudulBuku = document.getElementById("searchBookTitle").value;
  resetForm();
  e.preventDefault();
  pencarianBuku(cariJudulBuku);
});

function pencarianBuku(search) {
  const namaBuku = search.toLowerCase();
  for (const data of books) {
    if (data.title.toLowerCase().includes(namaBuku)) {
      dataPencarian.push(data);
    }
  }
  document.dispatchEvent(new Event(TAMPIL_DATA_PENCARIAN));
}
// AKHIR FITUR PENCARIAN BUKU
