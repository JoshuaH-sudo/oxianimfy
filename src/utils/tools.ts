import {ITaskData, taskRef} from "./custom_types";

const Joi = require("joi");

const formSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string().required(),
  desc: Joi.string().empty(""),
  daysOfWeek: Joi.array().items(Joi.string().required()).min(1),
  mesure: Joi.string().valid("none", "timer", "counter"),
  unit: Joi.when("mesure", {
    switch: [
      { is: "none", then: Joi.string() },
      { is: "timer", then: Joi.string().invalid('"P0D"',"0") },
      { is: "counter", then: Joi.number().min(1) },
    ],
  }),
});
export const validateTask = (newTask: ITaskData) => {
		const formIsInvalid = formSchema.validate(newTask); 
		console.log(formIsInvalid)
		return formIsInvalid.error ? true : false 
	}


