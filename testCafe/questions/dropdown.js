import { frameworks, url, url_test, applyTheme, setOptions, getListItemByText, completeButton, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion, registerCustomItemComponent } from "../helper";
import { Selector, fixture, test, ClientFunction } from "testcafe";
const title = "dropdown";

const questionDropdownSelect = Selector(".sv_q_dropdown_control");
const listItems = Selector(".sv-list__item span");
const questionValue = Selector(".sv_q_dropdown__value");
const questionValueInput = Selector(".sv_q_dropdown__value input");
const questionValueText = Selector(".sv_q_dropdown__value .sv-string-viewer");
const questionValueHint = Selector(".sv_q_dropdown__hint-suffix");

const clearButton = Selector(".sv_q_dropdown_clean-button");

const questionOffsetTopConst = 176;

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      const json = {
        questions: [
          {
            type: "dropdown",
            name: "car",
            title: "What car are you driving?",
            isRequired: true,
            colCount: 0,
            choices: [
              "None",
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen",
            ],
          },
          {
            type: "dropdown",
            name: "renderAsSelect",
            renderAs: "select",
            title: "What car are you driving?",
            colCount: 0,
            choices: [
              "None",
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen",
            ],
          },
        ],
      };

      await initSurvey(framework, json);
    }
  );

  test("choose empty", async (t) => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose value", async (t) => {
    let surveyResult;

    await t
      .click(questionDropdownSelect)
      .click(getListItemByText("Nissan"))
      .click(completeButton);

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.car).eql("Nissan");
  });

  test("change choices order render as select", async (t) => {
    const questionName = "renderAsSelect";
    const getFirst = Selector("select option").nth(1);
    const getSecond = Selector("select option").nth(2);
    let rnd_count = 0;
    let first, first_2;

    // asc
    await setOptions(questionName, { choicesOrder: "asc" });
    await t
      .expect(getFirst.textContent).eql("Audi")
      .expect(getSecond.textContent).eql("BMW");

    // desc
    await setOptions(questionName, { choicesOrder: "desc" });
    await t
      .expect(getFirst.textContent).eql("Volkswagen")
      .expect(getSecond.textContent).eql("Vauxhall");

    // rnd
    await t.expect(Selector("select option").count).notEql(1); // "need to more than one choices"

    first = await getFirst();
    for (let i = 0; i < 15; i++) {
      await setOptions(questionName, { choicesOrder: "asc" });
      await setOptions(questionName, { choicesOrder: "random" });
      first_2 = await getFirst();

      if (first.textContent.trim() !== first_2.textContent.trim()) {
        rnd_count++;
      }

      first = first_2;

      if (rnd_count >= 4) {
        break;
      }
    }

    await t.expect(rnd_count).gte(4); // because of 'none', 'asc', 'desc' and if 4 it is really rnd
  });

  test("change choices order", async (t) => {
    const firstItem = listItems.nth(0).textContent;
    const secondItem = listItems.nth(1).textContent;

    // asc
    await setOptions("car", { choicesOrder: "asc" });
    await t
      .click(questionDropdownSelect)
      .expect(firstItem).eql("Audi")
      .expect(secondItem).eql("BMW");

    // desc
    await setOptions("car", { choicesOrder: "desc" });
    await t
      .expect(firstItem).eql("Volkswagen")
      .expect(secondItem).eql("Vauxhall");

    // rnd
    await t.expect(listItems.count).notEql(1); // "need to more than one choices"

    let rnd_count = 0;
    let prevFirstItemValue = await listItems.nth(0).textContent;
    let firstItemValueCurrent;
    for (let i = 0; i < 15; i++) {
      await setOptions("car", { choicesOrder: "asc" });
      await setOptions("car", { choicesOrder: "random" });
      firstItemValueCurrent = await listItems.nth(0).textContent;

      if (prevFirstItemValue.trim() !== firstItemValueCurrent.trim()) {
        rnd_count++;
      }

      prevFirstItemValue = firstItemValueCurrent;

      if (rnd_count >= 4) {
        break;
      }
    }

    await t.expect(rnd_count).gte(4); // because of 'none', 'asc', 'desc' and if 4 it is really rnd
  });

  test("check integrity", async (t) => {
    const choices = [
      "None",
      "Ford",
      "Vauxhall",
      "Volkswagen",
      "Nissan",
      "Audi",
      "Mercedes-Benz",
      "BMW",
      "Peugeot",
      "Toyota",
      "Citroen",
    ];
    let checkIntegrity = async (t) => {
      await t.click(questionDropdownSelect);
      await t.expect(listItems.count).eql(choices.length);
      await t.click(questionDropdownSelect);

      for (let i = 0; i < choices.length; i++) {
        await t
          .click(questionDropdownSelect)
          .click(listItems.nth(i));
      }
    };

    await setOptions("car", { choicesOrder: "asc" });
    await checkIntegrity(t);

    await setOptions("car", { value: null });
    await setOptions("car", { choicesOrder: "desc" });
    await checkIntegrity(t);

    await setOptions("car", { value: null });
    await setOptions("car", { choicesOrder: "random" });
    await checkIntegrity(t);
  });

  test("show \"other\" choice", async (t) => {
    await t
      .click(questionDropdownSelect)
      .expect(listItems.count).eql(11);

    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click(questionDropdownSelect)
      .expect(listItems.count).eql(12)
      .expect(listItems.nth(11).textContent).contains("Other");
  });

  test("check \"other\" choice doesn't change order", async (t) => {
    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click(questionDropdownSelect)
      .expect(listItems.nth(11).textContent).eql("Other");

    await setOptions("car", { choicesOrder: "desc" });
    await t.expect(listItems.nth(11).textContent).eql("Other");
  });

  test("choose other", async (t) => {
    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click(questionDropdownSelect)
      .click(getListItemByText("Other"))
      .typeText(Selector("textarea"), "Zaporozec")
      .click(completeButton);

    let surveyResult = await getSurveyResult();
    await t
      .expect(surveyResult.car).eql("other")
      .expect(surveyResult["car-Comment"]).eql("Zaporozec");
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("open popup and blur", async (t) => {
    const json = {
      questions: [
        {
          type: "dropdown",
          name: "car",
          title: "What car are you driving?",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen",
          ],
        },
      ],
    };
    await initSurvey(framework, json);

    await t
      .click(questionDropdownSelect)
      .click(questionDropdownSelect)
      .expect(questionValueInput.getAttribute("placeholder")).eql("Select...")
      .expect(questionValueText.exists).notEql();
  });

  test("click on question title state editable", async (t) => {
    const json = {
      questions: [
        {
          type: "dropdown",
          name: "car",
          title: "What car are you driving?",
          isRequired: true,
          colCount: 0,
          choices: [
            "None",
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen",
          ],
        },
      ],
    };
    await initSurvey(framework, json, undefined, true);

    const newTitle = "MyText";
    let questionJson = JSON.parse(await getQuestionJson());
    let questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    const outerSelector = ".sv_q_title";
    const innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    questionJson = JSON.parse(await getQuestionJson());
    await t.expect(questionJson.title).eql(newTitle);
  });

  test("otherText changed", async t => {
    const currentJson = {
      title: "Survey New Design Test",
      description: "Survey Description",
      logoPosition: "left",
      questions: [
        {
          type: "dropdown",
          renderAs: "select",
          name: "car",
          title: "Dropdown",
          hasOther: true,
          showOptionsCaption: false,
          colCount: 4,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        },
        {
          type: "dropdown",
          name: "carss",
          title: "Dropdown render as",
          hasOther: true,
          colCount: 4,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        },
      ]
    };
    const oldOtherText = "Other (describe)";
    const newOtherText = "New Other";
    const questionDropdownSelect = Selector(".sv_q_dropdown_control");
    await initSurvey(framework, currentJson);

    await t.expect(Selector("select option").nth(10).textContent).eql(oldOtherText);
    await setOptions("car", { otherText: newOtherText });
    await t.expect(Selector("select option").nth(10).textContent).eql(newOtherText);

    await t
      .click(questionDropdownSelect.nth(1))
      .expect(Selector(".sv-list__item span").nth(10).textContent).eql(oldOtherText);
    await setOptions("carss", { otherText: newOtherText });
    await t
      .click(questionDropdownSelect.nth(1))
      .expect(Selector(".sv-list__item span").nth(10).textContent).eql(newOtherText);
  });

  test("placeholder changed", async t => {
    const currentJson = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        },
      ]
    };
    const oldPlaceholder = "Select...";
    const newPlaceholder = "New placeholder";
    await initSurvey(framework, currentJson);

    await t.expect(questionValueInput.getAttribute("placeholder")).eql(oldPlaceholder);
    await setOptions("cars", { placeholder: newPlaceholder });
    await t.expect(questionValueInput.getAttribute("placeholder")).eql(newPlaceholder);
  });

  test("Check dropdown popup width", async (t) => {
    await t.resizeWindow(1280, 1100);
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          searchEnabled: false,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await t
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownSelect)
      .expect(popupContainer.visible).ok()
      .expect(popupContainer.offsetWidth).gte(900)

      .click(Selector(".sv-list__item span").withText("Ford").filterVisible())
      .expect(popupContainer.visible).notOk()

      .click(questionValueText)
      .expect(popupContainer.visible).ok()
      .expect(popupContainer.offsetWidth).gte(900);
  });

  test("Check dropdown disabled items", async (t) => {
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          renderAs: "select",
          name: "cars",
          title: "Dropdown",
          isRequired: true,
          hasNone: true,
          colCount: 4,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        },
        {
          type: "dropdown",
          name: "DropdownRenderAsSelect",
          hasOther: "true",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    await ClientFunction(() => {
      const updateChoiceEnabled = (_, opt) => {
        opt.choices.forEach((ch, index) => { ch.setIsEnabled(index % 2 === 0); });
      };

      const oldDropdown = window["survey"].getQuestionByName("cars");
      oldDropdown.onOpened.add(updateChoiceEnabled);

      const selectQuestion = window["survey"].getQuestionByName("DropdownRenderAsSelect");
      selectQuestion.onOpened.add(updateChoiceEnabled);
    })();

    await t
      .expect(Selector("option[value=Vauxhall]").hasAttribute("disabled")).notOk()
      .click("select")
      .expect(Selector("option[value=Vauxhall]").hasAttribute("disabled")).ok()
      .click("option[value=Volkswagen]")

      .click("select")
      .expect(Selector("option[value=Vauxhall]").hasAttribute("disabled")).ok()
      .click("select");

    const questionDropdownSelect = Selector(".sv_q_dropdown_control").nth(1);
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await t
      .click(questionDropdownSelect)
      .expect(Selector(".sv-list__item").count).eql(28)
      .expect(Selector(".sv-list__item.sv-list__item--disabled").count).eql(13)
      .click(Selector(".sv-list__item span").withText("item2").filterVisible())
      .expect(popupContainer.visible).ok()
      .click(Selector(".sv-list__item span").withText("item3").filterVisible())
      .expect(popupContainer.visible).notOk();
  });

  test("Check dropdown clear button", async (t) => {
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    await t
      .expect(clearButton.exists).ok()
      .expect(clearButton.visible).notOk()

      .click(questionDropdownSelect)
      .click(Selector(".sv-list__item span").withText("Ford").filterVisible())

      .expect(clearButton.visible).ok()

      .click(clearButton)
      .expect(clearButton.exists).ok()
      .expect(clearButton.visible).notOk();
  });

  test("Check dropdown item template", async (t) => {
    await registerCustomItemComponent(framework);

    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          itemComponent: "new-item",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    const myListItems = Selector(".my-list-item");
    await t
      .expect(questionValueInput.getAttribute("placeholder")).eql("Select...")

      .click(questionDropdownSelect)

      .expect(myListItems.count).eql(10)
      .expect(myListItems.find(".sv-svg-icon").count).eql(10)

      .click(myListItems.nth(3))

      .expect(Selector(".sv_q_dropdown__value").find(".sv-svg-icon").count).eql(1);
  });

  test("Check dropdown key press with searchEnabled", async (t) => {
    const jsonWithDropDown = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "DropdownSearchEnabledFalse",
          title: "Dropdown",
          colCount: 0,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        },
        {
          type: "dropdown",
          name: "cars",
          colCount: 0,
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }
      ]
    };
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await initSurvey(framework, jsonWithDropDown);

    await t
      .pressKey("enter")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(questionValueInput.value).eql("Nissan")

      .pressKey("enter")
      .expect(popupContainer.visible).ok()
      .pressKey("up")
      .pressKey("enter")
      .expect(popupContainer.visible).notOk()
      .expect(questionValueInput.value).eql("Volkswagen")

      .pressKey("tab")
      .pressKey("2")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(questionValueInput.nth(1).value).eql("item20")

      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(questionValueInput.nth(1).value).eql("item21");
  });

  test("Select item after switching focus", async (t) => {
    const jsonWithDropDown = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);
    const popupContainer = Selector(".sv-popup__container").filterVisible();

    await t
      .expect(popupContainer.visible).notOk()

      .pressKey("a")
      .expect(popupContainer.visible).ok()

      .pressKey("u")
      .pressKey("tab")
      .expect(popupContainer.visible).notOk()
      .expect(questionValue.innerText).eql("")

      .click(questionDropdownSelect)
      .click(getListItemByText("Nissan"))
      .expect(questionValueInput.value).eql("Nissan")

      .pressKey("ctrl+a backspace")
      .pressKey("a u")
      .pressKey("tab")
      .expect(popupContainer.visible).notOk()
      .expect(questionValue.innerText).eql("Nissan");
  });

  test("Check dropdown key press without searchEnabled", async (t) => {
    const jsonWithDropDown = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "DropdownSearchEnabledFalse",
          searchEnabled: false,
          title: "Dropdown",
          colCount: 0,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        },
        {
          type: "dropdown",
          name: "cars",
          searchEnabled: false,
          colCount: 0,
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }
      ]
    };
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await initSurvey(framework, jsonWithDropDown);

    await t
      .pressKey("enter")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(questionValueText.textContent).eql("Nissan")

      .pressKey("space")
      .expect(popupContainer.visible).ok()
      .pressKey("up")
      .pressKey("space")
      .expect(popupContainer.visible).notOk()
      .expect(questionValueText.textContent).eql("Volkswagen")

      .pressKey("tab")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(questionValueText.nth(1).textContent).eql("item2");
  });

  test("Check dropdown SPACE press without searchEnabled", async (t) => {
    const jsonWithDropDown = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "q1",
          searchEnabled: false,
          title: "Dropdown",
          colCount: 0,
          choices: [
            "point",
            "itemzero",
            "item 1",
            "item 2",
            "stuff"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    await t
      .pressKey("down")
      .pressKey("down")
      .pressKey("space")
      .expect(questionValueText.textContent).eql("itemzero");
  });

  test("Check dropdown SPACE press with searchEnabled", async (t) => {
    const jsonWithDropDown = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "q1",
          title: "Dropdown",
          colCount: 0,
          choices: [
            "point2",
            "itemzero",
            "item 1",
            "item 2",
            "stuff"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    await t
      .pressKey("e m space 2")
      .pressKey("enter")
      .expect(questionValueInput.value).eql("item 2");
  });

  test("Check dropdown search", async (t) => {
    const jsonWithDropDown = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "Dropdown",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const listItems = Selector(".sv-list__item");

    await t
      .expect(popupContainer.visible).notOk()
      .expect(listItems.count).eql(0)
      .expect(listItems.filterVisible().count).eql(0)

      .pressKey("2")
      .expect(popupContainer.visible).ok()
      .expect(listItems.filterVisible().count).eql(10)

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)

      .pressKey("backspace")
      .expect(listItems.filterVisible().count).eql(10)

      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(questionValueInput.value).eql("item20")
      .expect(popupContainer.visible).notOk()

      .pressKey("down")
      .expect(popupContainer.visible).ok()
      .expect(listItems.filterVisible().count).eql(27)
      .expect(Selector(".sv-list__item.sv-list__item--selected").textContent).contains("item20")

      .pressKey("down")
      .pressKey("esc")
      .expect(questionValueInput.value).eql("item20");
  });

  test("Check dropdown key press with auto-generated list", async (t) => {
    const json = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "dropdown",
          defaultValue: 2016,
          "choicesMin": 2014,
          "choicesMax": 2023
        }
      ]
    };
    await initSurvey(framework, json);

    await t
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(questionValueInput.value).eql("2018");
  });

  test("Check reset focused item - no focus on first popup", async (t) => {
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "Dropdown",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const listItems = Selector(".sv-list__item");
    const focusedItem = Selector(".sv-list__item--focused");

    await t
      .expect(popupContainer.visible).notOk()
      .expect(listItems.count).eql(0)
      .expect(focusedItem.exists).notOk()

      .click(questionDropdownSelect)
      .expect(popupContainer.visible).ok()
      .expect(listItems.count).eql(27)
      .expect(focusedItem.exists).notOk()

      .hover(listItems.nth(2))
      .expect(focusedItem.exists).notOk();
  });

  test("Check dropdown reset filter string", async (t) => {
    const jsonWithDropdown = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "Dropdown",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropdown);
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const listItems = Selector(".sv-list__item");

    await t
      .expect(popupContainer.visible).notOk()
      .expect(listItems.count).eql(0)
      .expect(listItems.filterVisible().count).eql(0)

      .pressKey("2")
      .expect(clearButton.visible).notOk()

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)

      .pressKey("esc")
      .expect(questionValueInput.value).eql("")
      .expect(popupContainer.visible).notOk()
      .expect(clearButton.visible).notOk();
  });

  test("Check dropdown clear value by keyboard", async (t) => {
    const jsonWithDropDown = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          defaultValue: "Volkswagen",
          searchEnabled: "false",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        },
        {
          type: "dropdown",
          renderAs: "select",
          name: "DropdownRenderAsSelect",
          defaultValue: "Mercedes-Benz",
          searchEnabled: "false",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    const oldDropdown = Selector(".sv_q_dropdown_control").nth(1);
    await initSurvey(framework, jsonWithDropDown);

    await t
      .expect(questionValueText.textContent).eql("Volkswagen")
      .expect(oldDropdown.value).eql("Mercedes-Benz")

      .pressKey("delete")
      .expect(questionValueInput.getAttribute("placeholder")).eql("Select...")
      .expect(oldDropdown.value).eql("Mercedes-Benz")

      .pressKey("tab")
      .pressKey("delete")
      .expect(questionValueInput.getAttribute("placeholder")).eql("Select...")
      .expect(oldDropdown.value).eql("");
  });

  test("test locale", async (t) => {
    const json = { elements: [{ type: "dropdown", name: "q1", choices: [1, 2, 3] }] };
    await initSurvey(framework, json);
    const changeLocale = ClientFunction(() => {
      window["survey"].locale = "de";
    });
    await t.expect(questionValueInput.getAttribute("placeholder")).eql("Select...");
    await changeLocale();
    await t.expect(questionValueInput.getAttribute("placeholder")).eql("Bitte auswählen...");
  });

  test("Check popup scroll", async (t) => {
    const jsonWithDropDown = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "Dropdown",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        },
        {
          type: "dropdown",
          name: "Dropdown2",
          searchEnabled: false,
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27",
            "item28",
            "item29",
            "item30",
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);
    const popupContainer = Selector(".sv-popup__container");
    const focusedItem = Selector(".sv-list__item--focused span");

    await t
      .resizeWindow(1280, 600)

      .pressKey("enter")
      .expect(focusedItem.exists).ok()
      .expect(focusedItem.textContent).eql("item1")
      .expect(popupContainer.nth(0).visible).ok()
      .expect(popupContainer.nth(0).find(".sv-list__item").count).eql(27)
      .expect(popupContainer.nth(0).find(".sv-list").scrollTop).eql(0)

      .pressKey("up")
      .expect(focusedItem.textContent).eql("item27")
      .expect(popupContainer.nth(0).find(".sv-list").scrollTop).gt(400)

      .pressKey("tab")
      .pressKey("space")
      .expect(focusedItem.exists).ok()
      .expect(focusedItem.textContent).eql("item1")
      .expect(popupContainer.nth(1).visible).ok()
      .expect(popupContainer.nth(1).find(".sv-list__item").count).eql(30)
      .expect(popupContainer.nth(1).find(".sv-list").scrollTop).eql(0)

      .pressKey("up")
      .expect(focusedItem.textContent).eql("item30")
      .expect(popupContainer.nth(1).find(".sv-list").scrollTop).gt(400)

      .resizeWindow(1280, 1100);
  });

  const theme = "defaultV2";
  test.page(`${url_test}${theme}/${framework}`)("Check rating as dropdown", async (t) => {
    await applyTheme(theme);

    const jsonWithDropDown = {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "dropdown",
        }
      ]
    };
    const ratingAsDropdownPlaceHolder = "Select...";
    const ratingAsDropdown = Selector(".sd-dropdown .sd-dropdown__value");
    const ratingAsDropdownPlaceholder = ratingAsDropdown.find("input");
    const ratingAsDropdownText = ratingAsDropdown.find(".sv-string-viewer");
    await initSurvey(framework, jsonWithDropDown);

    await t
      .click(ratingAsDropdown)
      .click(getListItemByText("2"))
      .expect(ratingAsDropdownPlaceholder.getAttribute("placeholder")).eql("")
      .expect(ratingAsDropdownText.withText("2").visible).ok()

      .pressKey("delete")
      .expect(ratingAsDropdownPlaceholder.getAttribute("placeholder")).eql(ratingAsDropdownPlaceHolder);
  });
  test.page(`${url_test}${theme}/${framework}`)("Check dropdown popup width - long", async (t) => {
    await applyTheme(theme);
    const json = {
      "elements": [
        {
          "type": "dropdown",
          "name": "car",
          "title": "What car are you driving?",
          "choices": [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz 1 Mercedes-Benz 2 Mercedes-Benz 3 Mercedes-Benz 4 Mercedes-Benz 5 Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    await initSurvey(framework, json);
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const questionDropdownV2Select = Selector(".sd-dropdown");

    await t
      .resizeWindow(800, 600)
      .click(questionDropdownV2Select)
      .expect(popupContainer.clientWidth).lte(685)
      .click(getListItemByText("Ford"))

      .resizeWindow(1300, 600)
      .click(questionDropdownV2Select)
      .expect(popupContainer.clientWidth).lte(685);
  });

  function choicesLazyLoad(_, opt) {
    var getNumberArray = (skip = 1, count = 25) => {
      const result = [];
      for(let index = skip; index < (skip + count); index++) {
        result.push(index);
      }
      return result;
    };

    const total = 55;
    setTimeout(() => {
      if(opt.skip + opt.take < total) {
        opt.setItems(getNumberArray(opt.skip + 1, opt.take), total);
      } else {
        opt.setItems(getNumberArray(opt.skip + 1, total - opt.skip), total);
      }
    }, 500);
  }

  test.page(`${url_test}${theme}/${framework}`)("Check popup height with lazy loading", async (t) => {
    await applyTheme(theme);
    const json = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "country",
          title: "Select the country...",
          choicesLazyLoadEnabled: true
        }, {
          type: "checkbox",
          name: "question1",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6"
          ]
        }, {
          type: "dropdown",
          name: "kids",
          title: "Dropdown page 30",
          choicesLazyLoadEnabled: true,
          choicesLazyLoadPageSize: 30
        }
      ]
    };
    await initSurvey(framework, json, { onChoicesLazyLoad: choicesLazyLoad });
    const popupContainer = Selector(".sv-popup__container");
    const dropdown1 = popupContainer.nth(0);
    const dropdown2 = popupContainer.nth(1);

    await t
      .resizeWindow(1280, 900)

      .pressKey("enter")
      .expect(dropdown1.find(".sv-list__empty-container").visible).ok()
      .expect(dropdown1.find(".sv-popup__scrolling-content").offsetHeight).eql(48)
      .expect(listItems.filterVisible().count).eql(0)

      .wait(500)
      .expect(dropdown1.find(".sv-list__empty-container").visible).notOk()
      .expect(dropdown1.offsetTop).lt(200)
      .expect(dropdown1.find(".sv-popup__scrolling-content").offsetHeight).within(688, 708)
      .expect(dropdown1.find(".sv-list").scrollTop).eql(0)
      .expect(dropdown1.find(".sv-list").scrollHeight).within(1208, 1308)
      .expect(listItems.filterVisible().count).eql(26)

      .scrollBy(dropdown1.find(".sv-list"), 0, 1000)
      .wait(500)
      .expect(dropdown1.offsetTop).lt(200)
      .expect(dropdown1.find(".sv-popup__scrolling-content").offsetHeight).within(688, 708)
      .expect(dropdown1.find(".sv-list").scrollTop).within(546, 556)
      .expect(dropdown1.find(".sv-list").scrollHeight).within(2408, 2508)
      .expect(listItems.filterVisible().count).eql(51)

      .scrollBy(dropdown1.find(".sv-list"), 0, 2300)
      .wait(500)
      .expect(dropdown1.offsetTop).lt(200)
      .expect(dropdown1.find(".sv-popup__scrolling-content").offsetHeight).within(688, 708)
      .expect(dropdown1.find(".sv-list").scrollTop).within(1696, 1796)
      .expect(dropdown1.find(".sv-list").scrollHeight).within(2608, 2708)
      .expect(listItems.filterVisible().count).eql(55)

      .click(getListItemByText("55"))
      .click(Selector(".sd-dropdown").nth(1))
      .expect(dropdown2.find(".sv-list__empty-container").visible).ok()
      .expect(dropdown2.find(".sv-popup__scrolling-content").offsetHeight).eql(48)
      .expect(listItems.filterVisible().count).eql(0)

      .wait(500)
      .expect(dropdown2.find(".sv-list__empty-container").visible).notOk()
      .expect(dropdown2.offsetTop).eql(0)
      .expect(dropdown2.find(".sv-popup__scrolling-content").offsetHeight).within(708, 718)
      .expect(dropdown2.find(".sv-list").scrollTop).eql(0)
      .expect(dropdown2.find(".sv-list").scrollHeight).within(1358, 1508)
      .expect(listItems.filterVisible().count).eql(31)

      .scrollBy(dropdown2.find(".sv-list"), 0, 1000)
      .wait(500)
      .expect(dropdown2.find(".sv-list__empty-container").visible).notOk()
      .expect(dropdown2.offsetTop).eql(0)
      .expect(dropdown2.find(".sv-popup__scrolling-content").offsetHeight).within(708, 718)
      .expect(dropdown2.find(".sv-list").scrollTop).within(746, 846)
      .expect(dropdown2.find(".sv-list").scrollHeight).within(2608, 2658)
      .expect(listItems.filterVisible().count).eql(55)
      .click(getListItemByText("55"))

      .resizeWindow(1280, 1100);
  });

  test.page(`${url_test}${theme}/${framework}`)("Check popup height and position while searching", async (t) => {
    await applyTheme(theme);
    const json = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "country",
          title: "Select the country...",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }, {
          type: "checkbox",
          name: "question1",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6"
          ]
        }, {
          type: "dropdown",
          name: "kids",
          title: "dropdown page 30",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }
      ]
    };
    await initSurvey(framework, json);
    const popupContainer = Selector(".sv-popup__container");
    const dropdown1 = popupContainer.nth(0);
    const dropdown2 = popupContainer.nth(1);
    const listItems = Selector(".sv-list__item span");

    await t
      .resizeWindow(1280, 900)

      .pressKey("2")
      .expect(dropdown1.visible).ok()
      .expect(listItems.filterVisible().count).eql(10)
      .expect(dropdown1.find(".sv-list__empty-container").visible).notOk()
      .expect(dropdown1.offsetTop).eql(questionOffsetTopConst)
      .expect(dropdown1.find(".sv-popup__scrolling-content").offsetHeight).within(475, 485)

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)
      .expect(dropdown1.find(".sv-list__empty-container").visible).notOk()
      .expect(dropdown1.offsetTop).eql(questionOffsetTopConst)
      .expect(dropdown1.find(".sv-popup__scrolling-content").offsetHeight).eql(48)

      .pressKey("enter")
      .expect(dropdown1.visible).notOk()

      .click(Selector(".sd-dropdown").nth(1))
      .pressKey("2")
      .expect(dropdown2.visible).ok()
      .expect(listItems.filterVisible().count).eql(10)
      .expect(dropdown2.find(".sv-list__empty-container").visible).notOk()
      .expect(dropdown2.offsetTop).within(228, 238)
      .expect(dropdown2.find(".sv-popup__scrolling-content").offsetHeight).within(470, 480)

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)
      .expect(dropdown2.find(".sv-list__empty-container").visible).notOk()
      .expect(dropdown2.offsetTop).eql(768)
      .expect(dropdown2.find(".sv-popup__scrolling-content").offsetHeight).eql(48)

      .pressKey("enter")
      .expect(dropdown2.visible).notOk()

      .resizeWindow(1280, 1100);
  });

  test("do not render list items if the popup is closed", async (t) => {
    const json = {
      questions: [
        {
          type: "dropdown",
          name: "car",
          title: "What car are you driving?",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen",
          ],
        },
      ],
    };
    const listSelector = Selector(".sv-list");
    await initSurvey(framework, json);

    await t
      .expect(listSelector.exists).notOk()
      .click(questionDropdownSelect)
      .expect(listSelector.exists).ok();
  });

  test("Check dropdown popup close with mouse, bug #5860", async (t) => {
    const jsonWithDropDown = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "dropdown",
          name: "Dropdown",
          defaultValue: "item1",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const input = Selector(".sv_q_dropdown_control input").filterVisible();
    const str = Selector(".sv_q_dropdown_control .sv-string-viewer");

    await t
      .expect(popupContainer.visible).notOk()
      .pressKey("enter")
      .expect(popupContainer.visible).ok()
      .expect(input.value).eql("item1")
      .expect(str.visible).notOk()
      .pressKey("tab")
      .expect(str.visible).ok()
      .expect(str.textContent).eql("item1")
      .click(input)
      .expect(input.value).eql("item1")
      .pressKey("q")
      .expect(input.value).eql("item1q")
      .expect(str.visible).notOk();
  });

  test("Check dropdown close popup on selected item click", async (t) => {
    const jsonWithDropdown = {
      questions: [
        {
          type: "dropdown",
          name: "Dropdown",
          defaultValue: "item2",
          choices: [
            "item1",
            "item2",
            "item3"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropdown);
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const listItems = Selector(".sv-list__item");
    const selectedItem = Selector(".sv-list__item--selected");

    await t
      .expect(popupContainer.visible).notOk()
      .click(questionDropdownSelect)
      .expect(popupContainer.visible).ok()
      .expect(questionValueInput.value).eql("item2")
      .expect(selectedItem.exists).ok()
      .click(selectedItem)
      .expect(popupContainer.visible).notOk()
      .expect(questionValueInput.value).eql("item2");
  });

  test("Recalculate popup position after window resize", async t => {
    const json = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          isRequired: true,
          hasNone: true,
          colCount: 4,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        },
        {
          type: "dropdown",
          name: "q1",
          hasOther: "true",
          startWithNewLine: false,
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }
      ]
    };
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await initSurvey(framework, json);

    await t
      .resizeWindow(900, 600)
      .expect(popupContainer.visible).notOk()
      .click(questionDropdownSelect.nth(1))
      .expect(popupContainer.visible).ok()
      .expect(popupContainer.offsetTop).within(85, 95)
      .expect(popupContainer.offsetLeft).within(460, 470)
      .expect(popupContainer.offsetHeight).within(490, 500)
      .expect(popupContainer.offsetWidth).within(395, 400)

      .resizeWindow(1280, 1100)
      .expect(popupContainer.visible).ok()
      .expect(popupContainer.offsetTop).within(85, 95)
      .expect(popupContainer.offsetLeft).within(650, 660)
      .expect(popupContainer.offsetHeight).within(985, 990)
      .expect(popupContainer.offsetWidth).within(585, 595)

      .resizeWindow(900, 600)
      .expect(popupContainer.visible).ok()
      .expect(popupContainer.offsetTop).within(85, 95)
      .expect(popupContainer.offsetLeft).within(460, 470)
      .expect(popupContainer.offsetHeight).within(490, 540)
      .expect(popupContainer.offsetWidth).within(395, 440);
  });

  test("check dropdown after navigating between pages", async t => {
    const json = {
      "focusFirstQuestionAutomatic": false,
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "dropdown",
              "name": "question1",
              "choices": [
                1,
                2,
                3,
                4,
                5
              ]
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "dropdown",
              "name": "question3",
              "choices": [
                "Item 1",
                "Item 2",
                "Item 3"
              ]
            }
          ]
        }
      ],
      "showCompletedPage": false,
      "showQuestionNumbers": "off",
      "showProgressBar": "top",
      "checkErrorsMode": "onComplete"
    };
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await initSurvey(framework, json);

    await t
      .expect(popupContainer.exists).notOk()

      .click(questionDropdownSelect)
      .expect(popupContainer.exists).ok()

      .click(getListItemByText("3"))
      .expect(popupContainer.exists).notOk()

      .click(".sv_next_btn")
      .click(".sv_prev_btn")
      .expect(popupContainer.exists).notOk()

      .click(questionDropdownSelect)
      .expect(popupContainer.exists).ok()
      .pressKey("tab")
      .expect(questionValueText.textContent).eql("3")
      .expect(questionValueInput.getAttribute("placeholder")).eql("")

      .click(".sv_q_dropdown_clean-button")
      .expect(questionValueText.exists).notEql()
      .expect(questionValueInput.getAttribute("placeholder")).eql("Select...");
  });

  test.page(`${url_test}${theme}/${framework}`)("choicesFromQuestion, bug#5818", async (t) => {
    await applyTheme(theme);

    const json = {
      "elements": [
        {
          type: "checkbox",
          name: "car",
          title: "What cars have you being drived?",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen",
            "Tesla"
          ]
        },
        {
          "type": "dropdown",
          "name": "bestcar",
          "title": "What car did you enjoy the most?",
          "choicesFromQuestion": "car",
          "choicesFromQuestionMode": "selected"
        }
      ]
    };
    const questionDropdownV2Select = Selector(".sd-dropdown");
    await initSurvey(framework, json);
    await t
      .click(Selector(".sd-selectbase__label").withText("Nissan"))
      .click(Selector(".sd-selectbase__label").withText("Audi"))
      .click(Selector(".sd-selectbase__label").withText("Ford"));

    await t
      .click(questionDropdownV2Select)
      .click(getListItemByText("Ford"))
      .click(questionDropdownV2Select)
      .click(getListItemByText("Audi"));
  });

  test.page(`${url_test}${theme}/${framework}`)("Check dropdown popup opens after beak click", async (t) => {
    await t.resizeWindow(800, 600);
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          searchEnabled: false,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    const questionDropdownV2Select = Selector(".sd-dropdown");
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const dropdownWidth = await questionDropdownV2Select.getBoundingClientRectProperty("width");
    await t
      .expect(dropdownWidth).gt(550)
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).ok()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).ok()

      .click("body", { offsetX: 600, offsetY: 20 })
      .expect(popupContainer.visible).notOk();
  });

  test.page(`${url_test}${theme}/${framework}`)("Check dropdown popup opens after beak click - search enabled", async (t) => {
    await t.resizeWindow(800, 600);
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    const questionDropdownV2Select = Selector(".sd-dropdown");
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const dropdownWidth = await questionDropdownV2Select.getBoundingClientRectProperty("width");
    await t
      .expect(dropdownWidth).gt(550)
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).ok()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).ok()

      .click("body", { offsetX: 600, offsetY: 20 })
      .expect(popupContainer.visible).notOk();
  });

  test.page(`${url_test}${theme}/${framework}`)("Dropdown shold not be open when disabled", async (t) => {
    await t.resizeWindow(800, 600);
    const jsonWithDropDown = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "boolean",
              name: "Editable",
              defaultValueExpression: "false"
            },
            {
              type: "dropdown",
              name: "Dropdown",
              enableIf: "{Editable} = true",
              choices: ["Item 1", "Item 2", "Item 3"]
            }
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    const questionDropdownV2Select = Selector(".sd-dropdown");
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await t

      .click(questionDropdownV2Select)
      .expect(popupContainer.visible).notOk()

      .click(Selector(".sd-boolean__label").withText("Yes"))
      .expect(Selector(".sd-boolean__thumb-text").withText("Yes").visible).ok()
      .expect(popupContainer.visible).notOk();
  });
});