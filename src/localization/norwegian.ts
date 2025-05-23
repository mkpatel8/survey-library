import { surveyLocalization } from "survey-core";

export var norwegianSurveyStrings = {
  pagePrevText: "Forrige",
  pageNextText: "Neste",
  completeText: "Fullfør",
  previewText: "Forhåndsvisning",
  editText: "Redigere",
  startSurveyText: "Start",
  otherItemText: "Annet (beskriv)",
  noneItemText: "Ingen",
  selectAllItemText: "Velg alle",
  progressText: "Side {0} av {1}",
  indexText: "{0} av {1}",
  panelDynamicProgressText: "Ta opp {0} av {1}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "Besvarte {0} / {1} spørsmål",
  emptySurvey: "Det er ingen synlig side eller spørsmål i undersøkelsen.",
  completingSurvey: "Takk for at du fullførte undersøkelsen!",
  completingSurveyBefore: "Våre data viser at du allerede har gjennomført denne undersøkelsen.",
  loadingSurvey: "Undersøkelsen laster...",
  placeholder: "Velg...",
  ratingOptionsCaption: "Velge...",
  value: "verdi",
  requiredError: "Vennligst svar på spørsmålet.",
  requiredErrorInPanel: "Vennligst svar på minst ett spørsmål.",
  requiredInAllRowsError: "Vennligst svar på spørsmål i alle rader.",
  numericError: "Verdien skal være numerisk.",
  minError: "Verdien bør ikke være mindre enn {0}",
  maxError: "Verdien bør ikke være større enn {0}",
  textMinLength: "Vennligst skriv inn minst {0} tegn.",
  textMaxLength: "Vennligst skriv inn mindre enn {0} tegn.",
  textMinMaxLength: "Vennligst skriv inn mer enn {0} og mindre enn {1} tegn.",
  minRowCountError: "Vennligst fyll inn minst {0} rader.",
  minSelectError: "Vennligst velg minst {0} varianter.",
  maxSelectError: "Vennligst ikke velg mer enn {0} varianter.",
  numericMinMax: "'{0}' bør være lik eller mer enn {1} og lik eller mindre enn {2}",
  numericMin: "'{0}' bør være lik eller mer enn {1}",
  numericMax: "'{0}' bør være lik eller mindre enn {1}",
  invalidEmail: "Vennligst skriv inn en gyldig e-post adresse.",
  invalidExpression: "Uttrykket: {0} skal returnere 'sant'.",
  urlRequestError: "Forespørselen returnerte feilen '{0}'. {1}",
  urlGetChoicesError: "Forespørselen returnerte tomme data, eller 'sti' -egenskapen er feil",
  exceedMaxSize: "Filstørrelsen bør ikke overstige {0}.",
  otherRequiredError: "Vennligst skriv inn den andre verdien.",
  uploadingFile: "Filen din lastes opp. Vennligst vent noen sekunder og prøv igjen.",
  loadingFile: "Laster inn ...",
  chooseFile: "Velg fil (er) ...",
  noFileChosen: "Ingen fil valgt",
  filePlaceholder: "Dra og slipp en fil her, eller klikk på knappen nedenfor og velg en fil du vil laste opp.",
  confirmDelete: "Ønsker du å slette posten?",
  keyDuplicationError: "Denne verdien skal være unik.",
  addColumn: "Legg til kolonne",
  addRow: "Legg til rad",
  removeRow: "Fjern",
  emptyRowsText: "Det er ingen rader.",
  addPanel: "Legg til ny",
  removePanel: "Fjerne",
  choices_Item: "element",
  matrix_column: "Kolonne",
  matrix_row: "Rad",
  multipletext_itemname: "Tekst",
  savingData: "Resultatene lagres på serveren ...",
  savingDataError: "Det oppsto en feil, og vi kunne ikke lagre resultatene.",
  savingDataSuccess: "Resultatene ble lagret!",
  saveAgainButton: "Prøv igjen",
  timerMin: "min",
  timerSec: "sek",
  timerSpentAll: "Du har tilbrakt {0} på denne siden og {1} totalt.",
  timerSpentPage: "Du har tilbrakt {0} på denne siden.",
  timerSpentSurvey: "Du har tilbrakt {0} totalt.",
  timerLimitAll: "Du har tilbrakt {0} av {1} på denne siden og totalt {2} av {3}.",
  timerLimitPage: "Du har tilbrakt {0} av {1} på denne siden.",
  timerLimitSurvey: "Du har tilbrakt {0} av {1} totalt.",
  clearCaption: "Klar",
  signaturePlaceHolder: "Logg inn her",
  chooseFileCaption: "Velg Fil",
  takePhotoCaption: "Ta bilde",
  photoPlaceholder: "Klikk på knappen nedenfor for å ta et bilde med kameraet.",
  fileOrPhotoPlaceholder: "Dra og slipp eller velg en fil for å laste opp eller ta et bilde med kameraet.",
  replaceFileCaption: "Erstatt fil",
  removeFileCaption: "Fjern denne filen",
  booleanCheckedLabel: "Ja",
  booleanUncheckedLabel: "Nei",
  confirmRemoveFile: "Er du sikker på at du vil fjerne denne filen: {0}?",
  confirmRemoveAllFiles: "Er du sikker på at du vil fjerne alle filene?",
  questionTitlePatternText: "Spørsmålstittel",
  modalCancelButtonText: "Annullere",
  modalApplyButtonText: "Bruke",
  filterStringPlaceholder: "Skriv for å søke ...",
  emptyMessage: "Ingen data å vise",
  noEntriesText: "Det er ingen oppføringer ennå.\nKlikk på knappen nedenfor for å legge til en ny oppføring.",
  noEntriesReadonlyText: "Det er ingen oppføringer.",
  more: "Mer",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Alle valg er rangert",
  selectToRankEmptyUnrankedAreaText: "Dra og slipp valg her for å rangere dem"
};

surveyLocalization.locales["no"] = norwegianSurveyStrings;
surveyLocalization.localeNames["no"] = "norsk";

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} av {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Velge..."
// minError: "The value should not be less than {0}" => "Verdien bør ikke være mindre enn {0}"
// maxError: "The value should not be greater than {0}" => "Verdien bør ikke være større enn {0}"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Dra og slipp en fil her, eller klikk på knappen nedenfor og velg en fil du vil laste opp."
// emptyRowsText: "There are no rows." => "Det er ingen rader."
// multipletext_itemname: "text" => "Tekst"
// signaturePlaceHolder: "Sign here" => "Logg inn her"
// modalCancelButtonText: "Cancel" => "Annullere"
// modalApplyButtonText: "Apply" => "Bruke"
// filterStringPlaceholder: "Type to search..." => "Skriv for å søke ..."
// emptyMessage: "No data to display" => "Ingen data å vise"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Det er ingen oppføringer ennå.\nKlikk på knappen nedenfor for å legge til en ny oppføring."
// noEntriesReadonlyText: "There are no entries." => "Det er ingen oppføringer."
// more: "More" => "Mer"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Alle valg er rangert"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Dra og slipp valg her for å rangere dem"// takePhotoCaption: "Take Photo" => "Ta bilde"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Klikk på knappen nedenfor for å ta et bilde med kameraet."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Dra og slipp eller velg en fil for å laste opp eller ta et bilde med kameraet."
// replaceFileCaption: "Replace file" => "Erstatt fil"