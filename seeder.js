import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

import Angle from "./models/angle.js";
import Background from "./models/background.js";
import Brand from "./models/brand.js";
import Invoice from "./models/invoice.js";
import Module from "./models/module.js";
import Order from "./models/order.js";
import OrderBrief from "./models/orderBrief.js";
import OrderProduct from "./models/orderProduct.js";
import Permission from "./models/permission.js";
import Pose from "./models/pose.js";
import ProductType from "./models/productType.js";
import Property from "./models/property.js";
import Ratio from "./models/ratio.js";
import Role from "./models/role.js";
import Section from "./models/section.js";
import Service from "./models/service.js";
import ServiceCategory from "./models/serviceCategory.js";
import Theme from "./models/theme.js";
import TokenBlackList from "./models/tokenBlackList.js";
import User from "./models/user.js";
import UserActivity from "./models/userActivity.js";
import UserSource from "./models/userSource.js";
import CustomerSales from "./models/customerSales.js";
import ModelDetail from "./models/modelDetail.js";

import * as helper from "./helper.js";

dotenv.config();

const env = process.env;

faker.locale = "id_ID";

mongoose
  .set("strictQuery", false)
  .connect(env.MONGO_DB_URL)
  .then(() => console.log("Connection Open"))
  .catch((err) => console.log(`DB error => ${err}`));

const seedDB = async () => {
  await ModelDetail.deleteMany({});
  await CustomerSales.deleteMany({});
  await UserSource.deleteMany({});
  await Brand.deleteMany({});
  await Invoice.deleteMany({});
  await OrderBrief.deleteMany({});
  await OrderProduct.deleteMany({});
  await Order.deleteMany({});
  await UserActivity.deleteMany({});
  await User.deleteMany({});
  await TokenBlackList.deleteMany({});
  await Role.deleteMany({});
  await Pose.deleteMany({});
  await Permission.deleteMany({});
  await Module.deleteMany({});
  await Section.deleteMany({});
  await Property.deleteMany({});
  await Background.deleteMany({});
  await Ratio.deleteMany({});
  await Angle.deleteMany({});
  await Theme.deleteMany({});
  await ProductType.deleteMany({});
  await Service.deleteMany({});
  await ServiceCategory.deleteMany({});

  const generalSettingSection = await Section.create({
    name: "General Setting",
  });

  const PMKanbanSection = await Section.create({
    name: "PM Kanban",
  });

  const SPKanbanSection = await Section.create({
    name: "SP Kanban",
  });

  const crudUserModule = await Module.create({
    name: "CRUD USER",
    section: generalSettingSection._id,
  });

  const roleAndPermissionModule = await Module.create({
    name: "ROLES AND PERMISSION",
    section: generalSettingSection._id,
  });

  const crudCardModule = await Module.create({
    name: "CRUD CARD",
    section: PMKanbanSection._id,
  });

  const trashModule = await Module.create({
    name: "TRASH",
    section: PMKanbanSection._id,
  });

  const updateCard = await Module.create({
    name: "Update Card",
    section: PMKanbanSection._id,
    show: false,
  });

  const spCardModule = await Module.create({
    name: "SP CARD",
    section: SPKanbanSection._id,
  });

  const updateCardofSpCardModule = await Module.create({
    name: "Update Card",
    section: SPKanbanSection._id,
    show: false,
  });

  await Section.findByIdAndUpdate(
    generalSettingSection._id,
    {
      module: [crudUserModule._id, roleAndPermissionModule._id],
    },
    {
      new: true,
    }
  );

  await Section.findByIdAndUpdate(
    PMKanbanSection._id,
    {
      module: [crudCardModule._id, updateCard._id, trashModule._id],
    },
    {
      new: true,
    }
  );

  await Section.findByIdAndUpdate(
    SPKanbanSection._id,
    {
      module: [spCardModule._id, updateCardofSpCardModule._id],
    },
    {
      new: true,
    }
  );

  const addCrudUserPermission = await Permission.create({
    name: "Add",
    alias: "add user",
    module: crudUserModule._id,
  });

  const viewCrudUserPermission = await Permission.create({
    name: "View",
    alias: "view user",
    module: crudUserModule._id,
  });

  const updateCrudUserPermission = await Permission.create({
    name: "Update",
    alias: "update user",
    module: crudUserModule._id,
  });

  const deleteCrudUserPermission = await Permission.create({
    name: "Delete",
    alias: "delete user",
    module: crudUserModule._id,
  });

  const addRoleAndPermissionPermission = await Permission.create({
    name: "Add",
    alias: "add role and permission",
    module: roleAndPermissionModule._id,
  });

  const viewRoleAndPermissionPermission = await Permission.create({
    name: "View",
    alias: "view role and permission",
    module: roleAndPermissionModule._id,
  });

  const updateRoleAndPermissionPermission = await Permission.create({
    name: "Update",
    alias: "update role and permission",
    module: roleAndPermissionModule._id,
  });

  const deleteRoleAndPermissionPermission = await Permission.create({
    name: "Delete",
    alias: "delete role and permission",
    module: roleAndPermissionModule._id,
  });

  const addCrudCardPermission = await Permission.create({
    name: "Add",
    alias: "add crud card",
    module: crudCardModule._id,
  });

  const viewAllCrudCardPermission = await Permission.create({
    name: "View All",
    alias: "view all crud card",
    module: crudCardModule._id,
  });

  const viewOwnCrudCardPermission = await Permission.create({
    name: "View Own",
    alias: "view own crud card",
    module: crudCardModule._id,
  });

  const updateNamaCustomerofCrudCardPermission = await Permission.create({
    name: "Nama Customer",
    alias: "update nama customer of crud card",
    module: crudCardModule._id,
    sub_module: updateCard._id,
  });

  const updateBrandCustomerofCrudCardPermission = await Permission.create({
    name: "Brand",
    module: crudCardModule._id,
    alias: "update brand of crud card",
    sub_module: updateCard._id,
  });

  const updatePICSalesofCrudCardPermission = await Permission.create({
    name: "PIC sales",
    module: crudCardModule._id,
    alias: "update PIC sales of crud card",
    sub_module: updateCard._id,
  });

  const updatePICProjectofCrudCardPermission = await Permission.create({
    name: "PIC's project",
    module: crudCardModule._id,
    alias: "update PIC project of crud card",
    sub_module: updateCard._id,
  });

  const updateQtyofCrudCardPermission = await Permission.create({
    name: "Qty",
    module: crudCardModule._id,
    alias: "update qty of crud card",
    sub_module: updateCard._id,
  });

  const updateNamaProdukofCrudCardPermission = await Permission.create({
    name: "Nama Produk",
    module: crudCardModule._id,
    alias: "update nama produk of crud card",
    sub_module: updateCard._id,
  });

  const updateHargaofCrudCardPermission = await Permission.create({
    name: "Harga",
    module: crudCardModule._id,
    alias: "update harga of crud card",
    sub_module: updateCard._id,
  });

  const updateTotalofCrudCardPermission = await Permission.create({
    name: "Total",
    module: crudCardModule._id,
    alias: "update total of crud card",
    sub_module: updateCard._id,
  });

  const updatePhotoshootItemsofCrudCardPermission = await Permission.create({
    name: "Photoshoot Items",
    module: crudCardModule._id,
    alias: "update photoshoot items of crud card",
    sub_module: updateCard._id,
  });

  const updateBriefsofCrudCardPermission = await Permission.create({
    name: "Briefs",
    module: crudCardModule._id,
    alias: "update briefs of crud card",
    sub_module: updateCard._id,
  });

  const updateStatusCrudCardPermission = await Permission.create({
    name: "Update Status",
    alias: "update status crud card",
    module: crudCardModule._id,
  });

  const deleteCrudCardPermission = await Permission.create({
    name: "Delete",
    alias: "delete crud card",
    module: crudCardModule._id,
  });

  const hardDeleteTrashPermission = await Permission.create({
    name: "Hard Delete",
    alias: "hard delete trash",
    module: trashModule._id,
  });

  const restoreTrashPermission = await Permission.create({
    name: "Restore",
    alias: "restore trash",
    module: trashModule._id,
  });

  const addSPCardPermission = await Permission.create({
    name: "Add",
    alias: "add SP card",
    module: spCardModule._id,
  });

  const viewAllSPCardPermission = await Permission.create({
    name: "View All",
    alias: "view all SP card",
    module: spCardModule._id,
  });

  const updateNamaCustomerofSPCardPermission = await Permission.create({
    name: "Nama Customer",
    module: spCardModule._id,
    alias: "update nama customer of SP card",
    sub_module: updateCardofSpCardModule._id,
  });

  const updateNoHPofSPCardPermission = await Permission.create({
    name: "No. Hp",
    module: spCardModule._id,
    alias: "update no. hp of SP card",
    sub_module: updateCardofSpCardModule._id,
  });

  const updateNamaBrandofSPCardPermission = await Permission.create({
    name: "Nama Brand",
    module: spCardModule._id,
    alias: "update nama brand of SP card",
    sub_module: updateCardofSpCardModule._id,
  });

  const updatePICSalesofSPCardPermission = await Permission.create({
    name: "PIC Sales",
    module: spCardModule._id,
    alias: "update PIC sales of SP card",
    sub_module: updateCardofSpCardModule._id,
  });

  const updateProductServiceDetailsofSPCardPermission = await Permission.create(
    {
      name: "Service Service Details",
      module: spCardModule._id,
      alias: "update Service service details of SP card",
      sub_module: updateCardofSpCardModule._id,
    }
  );

  const updatePhotoshootItemsofSPCardPermission = await Permission.create({
    name: "Photoshoot Items",
    module: spCardModule._id,
    alias: "update photoshoot items of SP card",
    sub_module: updateCardofSpCardModule._id,
  });

  const updateBriefsofSPCardPermission = await Permission.create({
    name: "Briefs",
    module: spCardModule._id,
    alias: "update briefs of SP card",
    sub_module: updateCardofSpCardModule._id,
  });

  const updatePaymentDetailsofSPCardPermission = await Permission.create({
    name: "Payments Details",
    module: spCardModule._id,
    alias: "update payment details of SP card",
    sub_module: updateCardofSpCardModule._id,
  });

  const superAdmin = await Role.create({
    name: "Super Admin",
    permission: [
      addCrudUserPermission,
      viewCrudUserPermission,
      updateCrudUserPermission,
      deleteCrudUserPermission,
      addRoleAndPermissionPermission,
      viewRoleAndPermissionPermission,
      updateRoleAndPermissionPermission,
      deleteRoleAndPermissionPermission,
      addCrudCardPermission,
      viewAllCrudCardPermission,
      viewOwnCrudCardPermission,
      updateNamaCustomerofCrudCardPermission,
      updateBrandCustomerofCrudCardPermission,
      updatePICSalesofCrudCardPermission,
      updatePICProjectofCrudCardPermission,
      updateQtyofCrudCardPermission,
      updateNamaProdukofCrudCardPermission,
      updateHargaofCrudCardPermission,
      updateTotalofCrudCardPermission,
      updatePhotoshootItemsofCrudCardPermission,
      updateBriefsofCrudCardPermission,
      updateStatusCrudCardPermission,
      deleteCrudCardPermission,
      hardDeleteTrashPermission,
      restoreTrashPermission,
      addSPCardPermission,
      viewAllSPCardPermission,
      updateNamaCustomerofSPCardPermission,
      updateNoHPofSPCardPermission,
      updateNamaBrandofSPCardPermission,
      updatePICSalesofSPCardPermission,
      updateProductServiceDetailsofSPCardPermission,
      updatePhotoshootItemsofSPCardPermission,
      updateBriefsofSPCardPermission,
      updatePaymentDetailsofSPCardPermission,
    ],
  });

  const IT = await Role.create({
    name: "IT",
    permission: [
      addCrudUserPermission,
      viewCrudUserPermission,
      updateCrudUserPermission,
      deleteCrudUserPermission,
    ],
  });

  const HR = await Role.create({
    name: "HR",
  });

  const sales = await Role.create({
    name: "Sales",
    permission: [
      viewAllCrudCardPermission,
      viewOwnCrudCardPermission,
      addSPCardPermission,
      viewAllSPCardPermission,
      updateNamaCustomerofSPCardPermission,
      updateNoHPofSPCardPermission,
      updateNamaBrandofSPCardPermission,
      updatePICSalesofSPCardPermission,
      updateProductServiceDetailsofSPCardPermission,
      updatePhotoshootItemsofSPCardPermission,
      updateBriefsofSPCardPermission,
      updatePaymentDetailsofSPCardPermission,
      viewCrudUserPermission,
      addCrudCardPermission,
      updateNamaCustomerofCrudCardPermission,
      updateBrandCustomerofCrudCardPermission,
      updatePICSalesofCrudCardPermission,
      updatePICProjectofCrudCardPermission,
      updateQtyofCrudCardPermission,
      updateNamaProdukofCrudCardPermission,
      updateHargaofCrudCardPermission,
      updateTotalofCrudCardPermission,
      updatePhotoshootItemsofCrudCardPermission,
      updateBriefsofCrudCardPermission,
      updateStatusCrudCardPermission,
      deleteCrudCardPermission,
    ],
  });

  const project_manager = await Role.create({
    name: "Project Manager",
  });

  const photographer_lead = await Role.create({
    name: "Photografer Lead",
  });

  const photographer = await Role.create({
    name: "Photografer / Editor",
  });

  const videografer = await Role.create({
    name: "Videografer",
  });

  const costumer_care = await Role.create({
    name: "Costumer Care",
  });

  const stylist = await Role.create({
    name: "Makeup Artis / Stylist",
  });

  const model_handler = await Role.create({
    name: "Model Handler",
  });

  const product_handler = await Role.create({
    name: "Product Handler",
  });

  const customer = await Role.create({
    name: "Customer",
    permission: [viewOwnCrudCardPermission],
  });

  const model = await Role.create({
    name: "Model",
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "superAdmin@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: superAdmin._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "IT@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: IT._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "customer1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: customer._id,
  });

  await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "customer2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: customer._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "sales1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: sales._id,
  });

  await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "sales2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: sales._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "projectManager1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: project_manager._id,
  });

  await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "projectManager2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: project_manager._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "photographerLead1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: photographer_lead._id,
  });

  await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "photographerLead2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: photographer_lead._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "photographer1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: photographer._id,
  });

  await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "photographer2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: photographer._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "videografer1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: videografer._id,
  });

  await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "videografer2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: videografer._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "costumerCare1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: costumer_care._id,
  });

  await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "costumerCare2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: costumer_care._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "stylist1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: stylist._id,
  });

  await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "stylist2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: stylist._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "modelHandler1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: model_handler._id,
  });

  await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "modelHandler2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: model_handler._id,
  });

  await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "productHandler1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: product_handler._id,
  });

  await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "productHandler2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: product_handler._id,
  });

  const lightGreyBg = await Background.create({
    name: "Light Grey",
  });

  const pureWhiteBg = await Background.create({
    name: "Pure White",
  });

  const property1 = await Property.create({
    name: "Kursi",
  });

  const property2 = await Property.create({
    name: "Meja",
  });

  const property3 = await Property.create({
    name: "Tangga",
  });

  const model1 = await User.create({
    name: `${faker.name.firstName("male")} ${faker.name.lastName()}`,
    email: "model1@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: model._id,
  });

  const model2 = await User.create({
    name: `${faker.name.firstName("female")} ${faker.name.lastName()}`,
    email: "model2@mail.com",
    password: await helper.hashPassword("12345678"),
    phone: faker.phone.number("62##########"),
    role: model._id,
  });

  const ratio1 = await Ratio.create({
    name: "1:1",
  });

  const ratio2 = await Ratio.create({
    name: "4:5",
  });

  const ratio3 = await Ratio.create({
    name: "9:16",
  });

  const ratio4 = await Ratio.create({
    name: "16:9",
  });

  const pose1 = await Pose.create({
    name: "Statis",
  });

  const pose2 = await Pose.create({
    name: "Dinamis",
  });

  const productType1 = await ProductType.create({
    name: "Tas",
    type: "Aksesoris",
  });

  const productType2 = await ProductType.create({
    name: "Celana",
    type: "Bawahan",
  });

  const productType3 = await ProductType.create({
    name: "Jaket",
    type: "Atasan",
  });

  const productType4 = await ProductType.create({
    name: "Topi",
    type: "Aksesoris",
  });

  const productType5 = await ProductType.create({
    name: "Kemeja",
    type: "Aksesoris",
  });

  const productType6 = await ProductType.create({
    name: "Celana Pendek",
    type: "Bawahan",
  });

  const productType7 = await ProductType.create({
    name: "Kaos",
    type: "Atasan",
  });

  const productType8 = await ProductType.create({
    name: "Sweater",
    type: "Atasan",
  });

  const productType9 = await ProductType.create({
    name: "Kacamata",
    type: "Aksesoris",
  });

  const angle1 = await Angle.create({
    name: "Atas",
  });

  const angle2 = await Angle.create({
    name: "Bawah",
  });

  const theme1 = await Theme.create({
    name: "Atas",
  });

  const theme2 = await Theme.create({
    name: "Bawah",
  });

  const fotoCategory = await ServiceCategory.create({
    name: "Foto",
  });

  const videoCategory = await ServiceCategory.create({
    name: "Video",
  });

  const dllCategory = await ServiceCategory.create({
    name: "DLL",
  });

  await Service.create({
    name: "Plain Catalogue",
    category: fotoCategory._id,
    price: "99000",
    background: 1,
    ratio: 1,
    duration: 0,
    model: 1,
    pose: 1,
    fashion_props: 0,
    angle: 0,
    product_type: 1,
    referrence: 0,
    bts: 1,
    outdoor: 0,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "Lookbook Catalogue",
    price: "99000",
    category: fotoCategory._id,
    background: 0,
    ratio: 1,
    duration: 0,
    model: 1,
    pose: 0,
    fashion_props: 1,
    angle: 0,
    product_type: 1,
    referrence: 1,
    bts: 1,
    outdoor: 1,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "Product On White",
    price: "99000",
    category: fotoCategory._id,
    background: 1,
    ratio: 1,
    duration: 0,
    model: 0,
    pose: 0,
    fashion_props: 0,
    angle: 1,
    product_type: 1,
    referrence: 0,
    bts: 0,
    outdoor: 0,
    mobile: 1,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "Creative shot",
    price: "99000",
    category: fotoCategory._id,
    background: 1,
    ratio: 1,
    duration: 0,
    model: 0,
    pose: 0,
    fashion_props: 0,
    angle: 0,
    product_type: 1,
    referrence: 1,
    bts: 0,
    outdoor: 0,
    mobile: 1,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "Creative shot with hand",
    price: "99000",
    category: fotoCategory._id,
    background: 1,
    ratio: 1,
    duration: 0,
    model: 1,
    pose: 0,
    fashion_props: 0,
    angle: 0,
    product_type: 1,
    referrence: 1,
    bts: 1,
    outdoor: 0,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "Outdoor",
    category: videoCategory._id,
    price: "99000",
    background: 0,
    ratio: 1,
    duration: 0,
    model: 1,
    pose: 0,
    fashion_props: 1,
    angle: 0,
    product_type: 1,
    referrence: 1,
    bts: 1,
    outdoor: 1,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "Couple",
    price: "99000",
    category: fotoCategory._id,
    background: 0,
    ratio: 1,
    duration: 0,
    model: 1,
    pose: 0,
    fashion_props: 1,
    angle: 0,
    product_type: 1,
    referrence: 1,
    bts: 1,
    outdoor: 1,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "Video Lookbook",
    price: "99000",
    category: videoCategory._id,
    background: 0,
    ratio: 1,
    duration: 0,
    model: 1,
    pose: 1,
    fashion_props: 0,
    angle: 0,
    product_type: 1,
    referrence: 1,
    bts: 1,
    outdoor: 0,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "Video Creative",
    price: "99000",
    category: videoCategory._id,
    background: 0,
    ratio: 1,
    duration: 0,
    model: 1,
    pose: 1,
    fashion_props: 0,
    angle: 0,
    product_type: 1,
    referrence: 1,
    bts: 1,
    outdoor: 0,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "3D",
    price: "99000",
    category: dllCategory._id,
    background: 0,
    ratio: 1,
    duration: 1,
    model: 0,
    pose: 0,
    fashion_props: 0,
    angle: 0,
    product_type: 1,
    referrence: 1,
    bts: 0,
    outdoor: 0,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "Digital Imaging",
    category: fotoCategory._id,
    price: "99000",
    background: 0,
    ratio: 1,
    duration: 0,
    model: 0,
    pose: 0,
    fashion_props: 0,
    angle: 0,
    product_type: 1,
    referrence: 1,
    bts: 0,
    outdoor: 0,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Service.create({
    name: "Beauty Shot",
    price: "99000",
    category: fotoCategory._id,
    background: 0,
    ratio: 1,
    duration: 0,
    model: 1,
    pose: 0,
    fashion_props: 0,
    angle: 0,
    product_type: 1,
    referrence: 1,
    bts: 1,
    outdoor: 0,
    backgroundList: [lightGreyBg._id, pureWhiteBg._id],
    modelList: [model1._id, model2._id],
    ratioList: [ratio1._id, ratio2._id, ratio3._id, ratio4._id],
    poseList: [pose1._id, pose2._id],
    propertyList: [property1._id, property2._id, property3._id],
    productTypeList: [
      productType1,
      productType2,
      productType3,
      productType4,
      productType5,
      productType6,
      productType7,
      productType8,
      productType9,
    ],
    angleList: [angle1, angle2],
    themeList: [theme1, theme2],
  });

  await Brand.create({
    name: "Kyou Hobby Shop",
  });

  await Brand.create({
    name: "Usagi Paw",
  });

  await Brand.create({
    name: "Printpoi",
  });
};

seedDB().then(() => {
  console.log("Seeder running ...");
  mongoose.connection.close();
  console.log("Connection Close");
});
