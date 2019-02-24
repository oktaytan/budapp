class UI {
  constructor() {
    this.feedbackBudget = document.querySelector('.budget__feedback');
    this.feedbackGider = document.querySelector('.gider__feedback');
    this.budgetForm = document.querySelector('.budget__form');
    this.budgetInput = document.querySelector('.budget__input');
    this.butce = document.querySelector('#butce');
    this.giderler = document.querySelector('#giderler');
    this.kalan = document.querySelector('#kalan');
    this.giderlerForm = document.querySelector('.giderler__form');
    this.giderTitle = document.querySelector('#giderTitle');
    this.giderTutar = document.querySelector('#giderTutar');
    this.giderList = document.querySelector('.gider__list');
    this.budgetInit = document.querySelector('.budget__init');
    this.itemList = [];
    this.itemID = 0;
  }

  // Bütçe submit methodu
  submitBudgetForm() {
    let value = this.budgetInput.value;
    if (value === '' || value < 0) {
      this.feedbackBudget.classList.add('show');
      this.feedbackBudget.innerHTML = `Bütçe boş bırakılamaz ve negatif bir sayı olamaz.`;
      this.budgetInit.classList.add('show');
      setTimeout(() => {
        this.feedbackBudget.classList.remove('show');
        this.budgetInit.classList.remove('show');
      }, 3000);
    } else if (isNaN(value)) {
      this.feedbackBudget.classList.add('show');
      this.feedbackBudget.innerHTML = `Bu alana sadece rakam girebilirsiniz.`;
      this.budgetInit.classList.add('show');
      setTimeout(() => {
        this.feedbackBudget.classList.remove('show');
        this.budgetInit.classList.remove('show');
      }, 3000);
    } else {
      this.butce.textContent = value;
      this.budgetInput.value = '';
      this.kalanButce();
    }
  }

  // Kalan bütçe
  kalanButce() {
    const gider = this.toplamGider();
    const toplam = parseInt(this.butce.textContent) - gider;
    this.kalan.textContent = toplam;
  }

  // Giderler submit methodu
  submitGiderlerForm() {
    let giderAdi = this.giderTitle.value;
    let giderTutari = this.giderTutar.value;

    if (giderAdi === '') {
      this.feedbackGider.classList.add('show');
      this.feedbackGider.innerHTML = `Gider adı boş bırakılamaz.`;
      this.giderlerForm.classList.add('show');
      setTimeout(() => {
        this.feedbackGider.classList.remove('show');
        this.giderlerForm.classList.remove('show');
      }, 3000);
    } else if (giderTutari === '' || giderTutari < 0) {
      this.feedbackGider.classList.add('show');
      this.feedbackGider.innerHTML = `Tutar boş bırakılamaz ve negatif bir sayı olamaz.`;
      this.giderlerForm.classList.add('show');
      setTimeout(() => {
        this.feedbackGider.classList.remove('show');
        this.giderlerForm.classList.remove('show');
      }, 3000);
    } else if (isNaN(giderTutari)) {
      this.feedbackGider.classList.add('show');
      this.feedbackGider.innerHTML = `Tutar sadece rakamlardan oluşabilir`;
      this.giderlerForm.classList.add('show');
      setTimeout(() => {
        this.feedbackGider.classList.remove('show');
        this.giderlerForm.classList.remove('show');
      }, 3000);
    } else {
      let tutar = parseInt(giderTutari);

      let gider = {
        id: this.itemID,
        title: giderAdi,
        tutar
      }
      this.itemID++;
      this.itemList.push(gider);
      this.giderEkle(gider);

      this.giderTitle.value = '';
      this.giderTutar.value = '';

      // Kalan update
      this.kalanButce();
    }
  }

  // Gider ekle
  giderEkle(gider) {
    const li = document.createElement('li');
    li.classList.add('gider__content');
    li.innerHTML = `
    <span class="gider__adı"><span><img src="./img/gider-adi-before.svg" alt=""></span> ${gider.title}</span>
    <span class="gider__tutarı"><span><img src="./img/turk-lira.svg" alt=""></span> ${gider.tutar}</span>
    <button class="gider__edit" data-id='${gider.id}'>
      <img src="./img/edit.svg" alt="edit">
    </button>
    <button class="gider__delete" data-id='${gider.id}'>
      <img src="./img/delete.svg" alt="delete">
    </button>
    `;
    this.giderList.appendChild(li);
  }

  // Toplam Kalan
  toplamGider() {
    let toplam = 0;
    if (this.itemList.length > 0) {
      toplam = this.itemList.reduce((acc, curr) => {
        acc += curr.tutar;
        return acc;
      }, 0);
    }
    this.giderler.textContent = toplam;
    return toplam;
  }

  // Gider edit
  editGider(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement;

    // DOM' dan silme
    this.giderList.removeChild(parent);

    let gider = this.itemList.filter((item) => {
      return item.id === id;
    });

    this.giderTitle.value = gider[0].title;
    this.giderTutar.value = gider[0].tutar;
    this.giderTitle.focus();

    // Gider listesinden silme
    let geciciListe = this.itemList.filter((item) => {
      return item.id !== id;
    });

    this.itemList = geciciListe;
    this.kalanButce();
  }

  // Gider delete
  deleteGider(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement;

    // DOM' dan silme
    this.giderList.removeChild(parent);

    // Gider listesinden silme
    let geciciListe = this.itemList.filter((item) => {
      return item.id !== id;
    });

    this.itemList = geciciListe;
    this.kalanButce();
    this.giderTitle.focus();
  }

}

function eventListeners() {
  const budgetForm = document.querySelector('.budget__form');
  const giderlerForm = document.querySelector('.giderler__form');
  const giderList = document.querySelector('.gider__list');

  // UI sınıfından yeni bir instance
  const ui = new UI();

  // Bütçe formu submit edildiğinde
  budgetForm.addEventListener('submit', function (e) {
    e.preventDefault();
    ui.submitBudgetForm();
  });

  // Giderler formu submit edildiğinde
  giderlerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    ui.submitGiderlerForm();
  });

  // Giderler listesi tıklandığında
  giderList.addEventListener('click', function (e) {
    if (e.target.parentElement.classList.contains('gider__edit')) {
      ui.editGider(e.target.parentElement);
    } else if (e.target.parentElement.classList.contains('gider__delete')) {
      ui.deleteGider(e.target.parentElement);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  eventListeners();
});