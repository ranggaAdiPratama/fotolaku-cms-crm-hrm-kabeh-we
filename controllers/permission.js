import Permission from "../models/permission.js";
import Module from "../models/module.js";
import * as helper from "../helper.js";

export const index = async (req, res) => {
  try {
    const permissions = await Permission.find({});
    return helper.response(res, 200, "List Permissions", permissions);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err.message);
  }
};

// SECTION store
export const store = async (req, res) => {
  try {
    const { name, alias, module, submodule } = req.body;

    switch (true) {
      case !name:
        return helper.response(res, 400, "name is required");
      case !alias:
        return helper.response(res, 400, "alias is required");
      case !module:
        return helper.response(res, 400, "module is required");
    }

    const moduleExist = await Module.findOne({ _id: module });

    if (! moduleExist) {
      return helper.response(res, 400, "module is not registered");
    }

    const permission = await Permission.create({
      name,
      alias,
      module,
      submodule,
    });
    return helper.response(res, 200, "Permission successfully created", permission);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err);
  }
}
// !SECTION store

// SECTION update
export const update = async (req, res) => {
  try {
    const _id = req.params.id;

    let permission = await Permission.findById(_id);

    let { name, alias, module, submodule } = req.body;

    switch (true) {
      case !name:
        return helper.response(res, 400, "name is required");
      case !alias:
        return helper.response(res, 400, "alias is required");
      case !module:
        return helper.response(res, 400, "module is required");
    }

    const moduleExist = await Module.findOne({ _id: module });

    if (!moduleExist) {
      return helper.response(res, 400, "module is not registered");
    }

    await Permission.findByIdAndUpdate(_id, {
      name,
      alias,
      module,
      submodule,
    });

    permission = await Permission.findById(permission._id)

    return helper.response(res, 200, "Permission successfully updated", permission);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err);
  }
}
// !SECTION update

// SECTION destroy
export const destroy = async (req, res) => {
  try {
    await Permission.findByIdAndDelete(req.params.id);

    return helper.response(res, 200, "Permission succesfully deleted");
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION destroy