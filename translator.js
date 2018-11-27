"use strict";

// Demande le lancement de l'exécution quand toute la page Web sera chargée
window.addEventListener('load', go);

// SAM Design Pattern : http://sam.js.org/
let actions, model, state, view;

//-------------------------------------------------------------------- Init ---
// Point d'entrée de l'application
function go() {
  console.log('GO !');

  sandbox();

  const data = {
    authors: 'Prénom1 NOM1 et Prénom2 NOM2',
    languagesSrc: ['fr', 'en', 'es'],
    languagesDst: ['fr', 'en', 'es', 'it', 'ar', 'eo', 'ja', 'zh'],
    langSrc: 'fr',
    langDst: 'en',
    translations : translations1,
  };
  actions.initAndGo(data);
}

//-------------------------------------------------------------------- Tests ---

function sandbox() {

  function action_display(data) {
    // console.log(data);
    if (!data.error) {
      const language = languages[data.languageDst].toLowerCase();
      console.log(`'${data.expression}' s'écrit '${data.translatedExpr}' en ${language}`);
    } else {
      console.log('Service de traduction indisponible...');
    }
  }

  const expr = 'asperge';
  const langSrc = 'fr';
  const langDst = 'en';
  googleTranslation(expr, langSrc, langDst, action_display );
}

//------------------------------------------------------------------ Données ---

// Correspondance entre codes de langue et leur nom
// Pour d'autres langues, voir ici :  https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1
const languages = {
  fr: 'Français',
  en: 'Anglais',
  es: 'Espagnol',
  it: 'Italien',
  ar: 'Arabe',
  eo: 'Espéranto',
  ja: 'Japonais',
  zh: 'Chinois',
};

//------------------------------------------------------------------ Actions ---
// Actions appelées dans le code HTML quand des événements surviennent
//
actions = {

  initAndGo(data) {
    model.samPresent({
      do:'init',
      authors: data.authors,
      langSrc: data.langSrc,
      langDst: data.langDst,
      languagesSrc: data.languagesSrc,
      languagesDst: data.languagesDst,
      translations: data.translations,
    });
  },

  apropos(){
    alert("Traducteur - Application Web \n Auteur(s) : \n SORIMOUTOU Lenaick\n RODRIGUES Nicolas\n");
  }
};

//-------------------------------------------------------------------- Model ---
// Unique source de vérité de l'application
//
model = {
  tabs: {
    // TODO: propriétés pour les onglets
  },
  request: {
    languagesSrc: [],
    languagesDst: [],
    langSrc: '',
    langDst: '',
    expression: '',
  },
  translations: {
    values:[
      // ['fr','Asperge','en','Asparagus'],
    ],
  },
  sorted: {
    // TODO: propriétés pour trier les colonnes
  },
  marked: {
    // TODO: propriétés pour les lignes marquées pour suppression
  },
  pagination: {
    // TODO: propriétés pour gérer la pagination
  },
  app: {
    authors: '',
    mode: 'main',    // in ['main', 'lang']
    sectionId: 'app',
  },

  // Demande au modèle de se mettre à jour en fonction des données qu'on
  // lui présente.
  // l'argument data est un objet confectionné dans les actions.
  // Les propriétés de data comportent les modifications à faire sur le modèle.
  samPresent(data) {

    switch (data.do) {

      case 'init':
        this.app.authors = data.authors;
        this.request.languagesSrc = data.languagesSrc;
        this.request.languagesDst = data.languagesDst;
        this.request.langSrc = data.langSrc;
        this.request.langDst = data.langDst;
        this.translations.values = data.translations;
        break;


      case '':  // TODO: Autres modifications de model...

        break;

      default:
        console.error(`model.samPresent(), unknown do: '${data.do}' `);
    }

    // Demande à l'état de l'application de prendre en compte la modification
    // du modèle
    state.samUpdate(this);
  },

};
//-------------------------------------------------------------------- State ---
// État de l'application avant affichage
//
state = {
  tabs: {
    // TODO: données des onglets déduites de model
  },
  translations: {
    // TODO: données de traductions déduites de model (par langue notamment)
  },

  samUpdate(model) {

    // TODO: Toutes les mises à jour des données pour préparer l'affichage

    this.samRepresent(model);
  },

  // Met à jour l'état de l'application, construit le code HTML correspondant,
  // et demande son affichage.
  samRepresent(model) {
    let representation = '';
    let container = '';

    let tabsUI = view.tabsUI(model,state);
    container += tabsUI;

    let headerUI = view.headerUI(model,state);
    let containerUI = view.containerUI(model,state,container);
    representation += headerUI;
    representation += containerUI;

    // TODO: la représentation de l'interface est différente selon
    //       qu'on affiche l'onglet 'Traductions' (avec formulaire de traduction)
    //       ou qu'on affiche les onglets par langue...

    representation = view.generateUI(model, this, representation);

    view.samDisplay(model.app.sectionId, representation);
  },
};
//--------------------------------------------------------------------- View ---
// Génération de portions en HTML et affichage
//
view = {

  // Injecte le HTML dans une balise de la page Web.
  samDisplay(eltId, representation) {
    const elt = document.getElementById(eltId);
    elt.innerHTML = representation;
  },

  // Renvoit le HTML
  generateUI(model, state, representation) {
    return `
    <div class="container">
      ${representation}
    </div>
    `;
  },

  headerUI(model,state) {
    return `
    <section id="header" class="mt-4">
      <div class="row mb-4">
        <div class="col-6">
          <h1>Traducteur</h1>
        </div>
        <div class="col-6 text-right align-middle">
          <div class="btn-group mt-2">
            <button class="btn btn-primary">Charger</button>
            <button class="btn btn-ternary">Enregistrer</button>
            <button class="btn btn-secondary">Préférences</button>
            <button class="btn btn-primary" onclick="actions.apropos()" >À propos</button>
          </div>
        </div>
      </div>
    </section>
    `;
  },

  containerUI(model,state,container) {
    return `<div class="container"> 
    ${container}
    </div>`;

  },

  tabsUI(model,state){
    return`<section id="tabs">
      <div class="row justify-content-start ml-1 mr-1">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link active"
              href="#">Traductions
              <span class="badge badge-primary">4</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link " href="#">Français
              <span class="badge badge-primary">3</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link " href="#">Anglais
              <span class="badge badge-primary">2</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link " href="#">Arabe
              <span class="badge badge-primary">1</span>
            </a>
          </li>
          <li class="nav-item">
            <select class="custom-select" id="selectFrom">
              <option selected="selected" value="0">Autre langue...</option>
              <option value="es">Espagnol (1)</option>
              <option value="it">Italien (1)</option>
            </select>
          </li>
        </ul>
      </div>
    </section>
    <br /> 
    `
  },

};
