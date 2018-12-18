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
    model.tabs.init({
        items: [{ lang: 'Français', sq: 'fr' },
        { lang: 'Anglais', sq: 'en' },
        { lang: 'Espagnol', sq: 'es' },
        { lang: 'Italien', sq: 'it' },
        { lang: 'Arabe', sq: 'ar' },
        { lang: 'Espéranto', sq: 'eo' },
        { lang: 'Japonais', sq: 'ja' },
        { lang: 'Chinois', sq: 'zh' }],
    });

    const data = {
        authors: 'Prénom1 NOM1 et Prénom2 NOM2',
        languagesSrc: ['fr', 'en', 'es'],
        languagesDst: ['fr', 'en', 'es', 'it', 'ar', 'eo', 'ja', 'zh'],
        langSrc: 'fr',
        langDst: 'en',
        translations: translations1,
    };
    actions.initAndGo(data);
    actions.initLen();
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
    googleTranslation(expr, langSrc, langDst, action_display);
}


//----------------------------------------------Fonction global------
//fonction qui renvoie le nombre d'occurence avec la langue donnée
function len(data) {
    let n = 0;
    for (let i = 0; i < data.tab.length; i++) {
        if (data.tab[i][0] == data.lang || data.tab[i][2] == data.lang) {
            n += 1
        }
    }
    return (n);
}

function compare(a, b) {
    if (a.len < b.len)
        return 1;
    if (a.len > b.len)
        return -1;
    // a doit être égal à b
    return 0;
}

function divideArray(myArray, tab_size) {
    let index = 0;
    let arrayLength = myArray.length;
    let tempArray = [];
    let myChunk = [];
    for (index = 0; index < arrayLength; index += tab_size) {
        myChunk = myArray.slice(index, index + tab_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
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
            do: 'init',
            authors: data.authors,
            langSrc: data.langSrc,
            langDst: data.langDst,
            languagesSrc: data.languagesSrc,
            languagesDst: data.languagesDst,
            translations: data.translations,

        });
    },

    initLen() {
        model.samPresent({ do: 'initLen' });
    },

    apropos() {
        alert("Traducteur - Application Web \n Auteur(s) : \n SORIMOUTOU Lenaick\n RODRIGUES Nicolas\n");
    },

    //-----------Action Onglet-----------

    onglet(data) {
        let bool = (data.part == 1) ? false : true;
        model.samPresent({ do: 'onglet', bool: bool, part : data.part});
    },

    ongletChange(data) {
        model.samPresent({ do: 'ongletChange', index: data.index });
    },

    //----------Action Requête---------
    requestChange(data) {
        model.samPresent({ do: 'requestChange' });
    },
    requestChoice(data) {
        let value = data.e.target.value;
        let part = data.part;
        model.samPresent({ do: 'requestChoice', value: value, part: part });
    },

    addTrad(data) {
        let text = data.e.target.value;
        model.samPresent({ do: 'addTrad', text: text });
    },

    display(data) {
        // console.log(data);
        if (!data.error) {
            model.samPresent({ do: 'display', trad: data.translatedExpr });
        } else {
            console.log('Service de traduction indisponible...');
            model.samPresent({ do: 'display', trad: data.expression });
        }
    },

    //----------Action Pagination---------
    nombreLigne(data) {
        let tab = divideArray(model.tabs.tabFilt, parseInt(data.e.target.value));
        model.samPresent({ do: 'nombreLigne', nbLigne: parseInt(data.e.target.value), tab: tab });
    },

    goPage(data) {
        model.samPresent({ do: 'goPage', indexPage: data.index });
    },

    pageChange(data) {
        model.samPresent({ do: 'pageChange', nature: data.nature });
    },

    triTab(data) {
        model.samPresent({ do: 'triTab', part: data.col})
    },
    removeAll() {
        if (confirm("Êtes - vous sûr de vouloir supprimer \n toutes les traductions ?")) {
            model.samPresent({ do: 'removeAll' })
        }

    },
    selected(data) {
        model.samPresent({ do: 'selected', index: data.index})
    },
    sup() {
        model.samPresent({do:'sup'})
    },

};

//-------------------------------------------------------------------- Model ---
// Unique source de vérité de l'application
//
model = {
    tabs: {
        posdeux: false,
        posAutres: false,
        tableau: [],
        tabFilt: [],
        init(data) {
            this.tableau = data.items || [];
        },

    },
    request: {
        languagesSrc: [],
        languagesDst: [],
        langSrc: '',
        langDst: '',
        expression: '',
        disable: false,
        disable2: false,
    },
    translations: {
        values: [
            // ['fr','Asperge','en','Asparagus'],
        ],
    },
    sorted: {
        // TODO: propriétés pour trier les colonnes
        langI: false,
        num : false,
        vers: false,
        exp: false,
        trad: false,
        values: [],
        index : [],

    },
    marked: {
        onMarke: false,
        selected: [],

    },
    pagination: {
        lignes: '',
        values: [],
        active: '',
        nbPage: '',

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
                this.pagination.values = divideArray(this.translations.values, 9);
                this.pagination.lignes = 9;
                this.pagination.active = 1;
                this.pagination.nbPage = 1;
                this.marked.selected = [{index :0, selected : false}, {index :1, selected : false}, {index :2, selected : false}, {index :3, selected : false}];
                break;

            case 'initLen':
                for (let i = 0; i < this.tabs.tableau.length; i++) {
                    this.tabs.tableau[i].len = len({ tab: this.translations.values, lang: this.tabs.tableau[i].sq });
                }
                break;

            case 'onglet':
                console.log(this.translations.values);
                this.tabs.tableau.sort(compare)
                this.tabs.posdeux = data.bool;
                this.tabs.posAutres = false;
                if(this.tabs.posdeux){
                  this.tabs.tabFilt =  this.translations.values.filter((v, i, a) => v[0] == this.tabs.tableau[data.part - 2].sq || v[2] == this.tabs.tableau[data.part - 2].sq);
                }
                else{
                  this.tabs.tabFilt = this.translations.values.slice();
                }
                this.pagination.values = divideArray(this.tabs.tabFilt, this.pagination.lignes);
                break;

            case 'ongletChange':
                [this.tabs.tableau[0], this.tabs.tableau[data.index]] = [this.tabs.tableau[data.index], this.tabs.tableau[0]];
                this.tabs.posdeux = true;
                this.tabs.posAutres = true;
                this.tabs.tabFilt = (this.tabs.posdeux) ? this.translations.values.filter((v, i, a) => v[0] == this.tabs.tableau[0].sq || v[2] == this.tabs.tableau[0].sq) : this.translations.values.slice();
                this.pagination.values = divideArray(this.tabs.tabFilt, this.pagination.lignes);
                break;

            case 'requestChoice':
                if (data.part == 'langSrc') {
                    this.request.langSrc = data.value;
                }
                else {
                    this.request.langDst = data.value;
                }
                this.request.disable = (this.request.langSrc == this.request.langDst)
                this.request.disable2 = (this.request.langSrc == this.request.langDst || !this.request.languagesSrc.includes(this.request.langDst));
                break;

            case 'requestChange':
                [this.request.langSrc, this.request.langDst] = [this.request.langDst, this.request.langSrc];
                break;
            case 'addTrad':
                this.request.expression = data.text
                googleTranslation(data.text, this.request.langSrc, this.request.langDst, actions.display);
                break;

            case 'display':
                this.translations.values.push([this.request.langSrc, this.request.expression, this.request.langDst, data.trad]);
                this.pagination.values = divideArray(this.translations.values, this.pagination.lignes);
                this.pagination.nbPage = this.pagination.values.map((v, i, a) => { this.pagination.nbPage += 1; });
                this.marked.selected.push({index : this.marked.selected.length, selected:false});
                actions.initLen();
                actions.onglet({ part: 1 });
                if (this.sorted.num) {
                    this.sorted.num = false;
                    actions.triTab({col:'num'})
                }
                if (this.sorted.langI) {
                    this.sorted.langI = false;
                    actions.triTab({ col: 'langI' })
                }
                break;

            case 'nombreLigne':
                this.pagination.lignes = data.nbLigne;
                this.pagination.values = data.tab;
                model.pagination.active = 1;
                break;

            case 'goPage':
                this.pagination.active = data.indexPage;
                break;

            case 'pageChange':
                this.pagination.active = (data.nature == "prec") ? this.pagination.active - 1 : this.pagination.active + 1;

                break;
            case 'removeAll':
                this.translations.values = [];
                this.pagination.values = [];
                this.marked.selected = [];
                this.marked.onMarke = false;
                break;
            case 'selected':

                this.marked.selected[data.index].selected = !this.marked.selected[data.index].selected;
                for( let j = 0 ; j< this.marked.selected.length; j++){
                  if(this.marked.selected[j].selected == true){
                    this.marked.onMarke = true;
                    break;
                  }
                  this.marked.onMarke = false;

                }
                break;

            case 'sup':
                let filter = this.marked.selected.filter((v,i,a) => v.selected)
                filter.sort(compare);
                filter = filter.map((v,i,a) => v.index)
                this.marked.onMarke = false;
                for (let i = 0; i < filter.length; i++) {
                    this.translations.values.splice(filter[i], 1);
                    this.marked.selected.splice(filter[i], 1);
                    this.marked.selected.map((v,i,a) => v.index = i)

                    filter = filter.map((v,i,a) => v-1)
                }
                this.pagination.values = divideArray(this.translations.values, this.pagination.lignes);
                if (this.pagination.values[this.pagination.active - 1] == undefined) {
                    this.pagination.active -= (this.pagination.active == 1) ? 0 : 1;
                }
                break;
            case 'triTab':

                if (data.part == "num" && !this.sorted.num) {
                    this.sorted.num = !this.sorted.num
                    this.sorted.values = this.translations.values.slice();
                    this.sorted.values.reverse()
                    this.pagination.values = divideArray(this.sorted.values, this.pagination.lignes);
                }
                else if (data.part == "num" && this.sorted.num) {
                    this.sorted.num = !this.sorted.num
                    this.sorted.values = this.translations.values.slice();
                    this.sorted.values.reverse().reverse()
                    this.pagination.values = divideArray(this.sorted.values, this.pagination.lignes);
                }
                else if (data.part == "langI" && !this.sorted.langI) {
                    this.sorted.langI = !this.sorted.langI
                    this.sorted.values = this.translations.values.slice();
                    this.sorted.values.sort((a, b) => a[0] > b[0] )
                    this.pagination.values = divideArray(this.sorted.values, this.pagination.lignes);
                }
                else if (data.part == "langI" && this.sorted.langI) {
                    this.sorted.langI = !this.sorted.langI
                    this.sorted.values = this.translations.values.slice();
                    this.sorted.values.sort((a, b) => a[0] < b[0])
                    this.pagination.values = divideArray(this.sorted.values, this.pagination.lignes);
                }
                else if (data.part == "exp" && !this.sorted.exp) {
                    this.sorted.exp = !this.sorted.exp
                    this.sorted.values = this.translations.values.slice();
                    this.sorted.values.sort((a, b) => a[1] > b[1] )
                    this.pagination.values = divideArray(this.sorted.values, this.pagination.lignes);
                }
                else if (data.part == "exp" && this.sorted.exp) {
                    this.sorted.exp = !this.sorted.exp
                    this.sorted.values = this.translations.values.slice();
                    this.sorted.values.sort((a, b) => a[1] < b[1])
                    this.pagination.values = divideArray(this.sorted.values, this.pagination.lignes);
                }
                else if (data.part == "vers" && !this.sorted.vers) {
                    this.sorted.vers = !this.sorted.vers
                    this.sorted.values = this.translations.values.slice();
                    this.sorted.values.sort((a, b) => a[2] > b[2] )
                    this.pagination.values = divideArray(this.sorted.values, this.pagination.lignes);
                }
                else if (data.part == "vers" && this.sorted.vers) {
                    this.sorted.vers = !this.sorted.vers
                    this.sorted.values = this.translations.values.slice();
                    this.sorted.values.sort((a, b) => a[2] < b[2])
                    this.pagination.values = divideArray(this.sorted.values, this.pagination.lignes);
                }
                else if (data.part == "trad" && !this.sorted.trad) {
                    this.sorted.trad = !this.sorted.trad
                    this.sorted.values = this.translations.values.slice();
                    this.sorted.values.sort((a, b) => a[3] > b[3] )
                    this.pagination.values = divideArray(this.sorted.values, this.pagination.lignes);
                }
                else if (data.part == "trad" && this.sorted.trad) {
                    this.sorted.trad = !this.sorted.trad
                    this.sorted.values = this.translations.values.slice();
                    this.sorted.values.sort((a, b) => a[3] < b[3])
                    this.pagination.values = divideArray(this.sorted.values, this.pagination.lignes);
                }
                else {
                    this.pagination.values = divideArray(this.translations.values, this.pagination.lignes);
                }

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

        let tabsUI = view.tabsUI(model, state);
        let requestUI = view.requestUI(model, state);
        let translationsUI = view.translationsUI(model, state);
        container += tabsUI + requestUI + translationsUI;

        let headerUI = view.headerUI(model, state);
        let containerUI = view.containerUI(model, state, container);
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

    headerUI(model, state) {
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

    containerUI(model, state, container) {
        return `<div class="container">
    ${container}
    </div>`;

    },

    tabsUI(model, state) {
        let sortedLang = model.tabs.tableau;
        let t = model.translations.values.length;

        let first = (len({ tab: model.translations.values, lang: sortedLang[0].sq }) != 0) ? `<li class="nav-item">
            <a class="nav-link ${(model.tabs.posdeux) ? `active` : ``}" href="#" onclick="actions.onglet({part: 2})" >${sortedLang[0].lang}
              <span class="badge badge-primary">${len({ tab: model.translations.values, lang: sortedLang[0].sq })}</span>
            </a>
          </li>`: ``;
        let li = sortedLang.map((v, i, a) => {
            if (len({ tab: model.translations.values, lang: sortedLang[i].sq }) != 0 && i > 0 && i<3) {
                return `<li class="nav-item">
            <a class="nav-link" href="#" onclick="actions.ongletChange({index: ${i}})" >${sortedLang[i].lang}
              <span class="badge badge-primary">${len({ tab: model.translations.values, lang: sortedLang[i].sq })}</span>
            </a>
          </li>`
            }
        })
        let select = sortedLang.map((v, i, a) => {
            if (len({ tab: model.translations.values, lang: sortedLang[i].sq }) != 0 && i > 3) {
                return (` <option value="${i}">${sortedLang[i].lang} (${len({ tab: model.translations.values, lang: sortedLang[i].sq })})</option>`)
            }})

        return `<section id="tabs">
      <div class="row justify-content-start ml-1 mr-1">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link ${(model.tabs.posdeux) ? `` : `active`}"
              href="#" onclick="actions.onglet({part : 1})" >Traductions
              <span class="badge badge-primary">${t}</span>
            </a>
          </li>
          ${first}
          ${li.join("\n")}
          <li class="nav-item">
            <select class="custom-select" id="selectFrom" onchange="actions.ongletChange({index: event.target.value})">
              <option selected="selected" value="0" >Autre langue...</option>
              ${select.join("\n")}
            </select>
          </li>
        </ul>
      </div>
    </section>
    <br />
    `
    },

    requestUI(model, state) {
        let disable = (model.request.disable) ? `disabled = 'disabled'` : ``;
        let disable2 = (model.request.disable2) ? `class="btn btn-ternary"` : ` class="btn btn-secondary" onclick="actions.requestChange()"`;
        let selected = `selected="selected"`
        let indexSrc = model.request.languagesSrc.indexOf(model.request.langSrc);
        let indexDst = model.request.languagesDst.indexOf(model.request.langDst);

        let optionSrc = model.request.languagesSrc.map((v, i, a) => { return `<option value="${v}">${languages[v]}</option>` })
        optionSrc[indexSrc] = optionSrc[indexSrc].replace(`<option`, `<option selected="selected"`);
        let optionDst = model.request.languagesDst.map((v, i, a) => { return `<option value="${v}">${languages[v]}</option>` })
        optionDst[indexDst] = optionDst[indexDst].replace(`<option`, `<option selected="selected"`);


        return (model.tabs.posdeux) ? `` : `<section id="request">
      <form action="">
        <div class="form-group">
          <fieldset class="form-group">
            <div class="row align-items-end">
              <div class="col-sm-3 col-5">
                <div class="form-group">
                  <label for="selectFrom">Depuis</label>
                  <select class="custom-select" id="selectFrom" onchange="actions.requestChoice({e: event, part: 'langSrc'})">
                    ${optionSrc.join("/n")}
                  </select>
                </div>
              </div>
              <div class="form-group col-sm-1 col-2">
                <button type="button" ${disable2}>⇄</button>
              </div>
              <div class="col-sm-3 col-5">
                <div class="form-group">
                  <label for="selectTo">Vers</label>
                  <select class="custom-select" id="selectTo" onchange="actions.requestChoice({e: event, part: 'langDst'})">
                    	${optionDst.join("/n")}
                  </select>
                </div>
              </div>
              <div class="col-sm-5 col-12">
                <div class="input-group mb-3">
                  <input value="" id="expressionText" type="text" class="form-control"  onchange="actions.addTrad({e:event})" placeholder="Expression..." />
                  <div class="input-group-append">
                    <button class="btn btn-primary" type="button" ${disable}>Traduire</button>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </form>
    </section>`
    },

    //------------------ TODO NR : Pagination------------------------
    //--------Code HTML de la Pagination --------
    paginationUI(model, state) {
        let nbPage = model.pagination.values.map((v, i, a) => {
            return (model.pagination.active == i + 1) ? `<li class="page-item active">
                                                            <a class="page-link" href="#">${i + 1}</a>
                                                         </li>`:
                                                        `<li class="page-item ">
                                                            <a class="page-link" href="#" onclick="actions.goPage({index:${i + 1}})">${i + 1}</a>
                                                        </li>`;
        });
        let prec = (model.pagination.active == 1 || model.translations.values.length == 0 ) ? `<li class="page-item disabled">
                                                          <a class="page-link" href="#" tabindex="-1" >Précédent</a>
                                                        </li>`:
            `<li class="page-item ">
                                                          <a class="page-link" href="#" tabindex="-1" onclick="actions.pageChange({nature : 'prec'})">Précédent</a>
                                                        </li>`;
        let suiv = (model.pagination.active == model.pagination.values.length || model.translations.values.length == 0 ) ? `<li class="page-item disabled">
                                                                              <a class="page-link" href="#">Suivant</a>
                                                                            </li>`:
                                                                        `<li class="page-item ">
                                                                              <a class="page-link" href="#" onclick="actions.pageChange({nature : 'suiv'})">Suivant</a>
                                                                            </li>`;
        let pag = [3, 6, 9].map((v, i, a) => {
            return (model.pagination.lignes == v) ? `<option selected="selected" value="${v}">${v}</option>` :
                `<option value="${v}">${v}</option>`;
        });
        return `<section id="pagination">
              <div class="row justify-content-center">

                <nav class="col-auto">
                  <ul class="pagination">
                    ${prec}
                    ${nbPage.join('\n')}
                    ${suiv}
                  </ul>
                </nav>

                <div class="col-auto">
                  <div class="input-group mb-3">
                    <select class="custom-select" id="selectTo" onchange="actions.nombreLigne({e:event})">
                      ${pag.join('\n')}
                    </select>
                    <div class="input-group-append">
                      <span class="input-group-text">par page</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>`
    },

    //------------------ TODO LS : translation------------------------
    //----------Remplie le tableau ligne par ligne en fonction de données dans model--------
    tableauUI(model, state) {
        let activeSup = (model.marked.onMarke) ? `onclick ="actions.sup()" class="btn btn-secondary"` : `class="btn btn-ternary"`;
        let disable = (model.pagination.values.length == 0) ? `class="btn btn-ternary"` : `onclick="actions.removeAll({})" class="btn btn-secondary" `;
        let Ar = model.translations.values
        let elt = (model.pagination.values.length == 0)?  [] : model.pagination.values[model.pagination.active - 1].map((v, i, a) => {
            return `<tr>
              <td class="text-center text-secondary"> ${Ar.indexOf(v)} </td>
              <td class="text-center">
                <span class="badge badge-info">${v[0]}</span>
              </td>
              <td ${(v[0] == 'ar')? `class="text-right"`:``}>${v[1]}</td>
              <td class="text-center">
                <span class="badge badge-info">${v[2]}</span>
              </td>
              <td>${v[3]}</td>
              <td class="text-center">
                <div class="form-check">
                  <input type="checkbox" ${(model.marked.selected[(model.pagination.active == 1) ? i : i + model.pagination.lignes * (model.pagination.active - 1)].selected) ? `checked="checked" `: ``}onclick = "actions.selected({index : ${(model.pagination.active == 1) ? i : i + model.pagination.lignes * (model.pagination.active - 1)}})" class="form-check-input" />
                </div>
              </td>
            </tr>`
        })
        return `<table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-1">
                <a href="#" onclick="actions.triTab({col : 'num',})" >N°</a>
              </th>
              <th class="align-middle text-center col-1">
                <a href="#" onclick="actions.triTab({col : 'langI'})">Depuis</a>
              </th>
              <th class="align-middle text-center ">
                <a href="#" onclick="actions.triTab({col : 'exp'})">Expression</a>
              </th>
              <th class="align-middle text-center col-1">
                <a href="#" onclick="actions.triTab({col : 'vers'})">Vers</a>
              </th>
              <th class="align-middle text-center ">
                <a href="#" onclick="actions.triTab({col : 'trad'})">Traduction</a>
              </th>
              <th class="align-middle text-center col-1">
                <div class="btn-group">
                  <button ${activeSup}>Suppr.</button>
                </div>
              </th>
            </thead>
            ${elt.join('\n')}
            <tr xmlns="http://www.w3.org/1999/xhtml">
              <td colspan="5" class="align-middle text-center"> </td>
              <td class="align-middle text-center">
                <div class="btn-group">
                  <button  ${disable}>Suppr. tous</button>
                </div>
              </td>
            </tr>
          </table>`
    },
    //----------Représentation du tableau--------
    translationsUI(model, state) {
        let pagination = view.paginationUI(model, state);
        let tab = view.tableauUI(model, state);
        return ` <section id="translations">
      <fieldset>
        <legend class="col-form-label">Traductions</legend>
        <div class="table-responsive">
          ${tab}
        </div>

        ${pagination}

      </fieldset>
    </section>`
    },

};
