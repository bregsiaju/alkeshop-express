const { Category } = require('../../models')
const ApiError = require('../../utils/ApiError')

const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body

    const isCategoryExist = await Category.findOne({ where: { categoryName } })
    console.log(categoryName)
    if (isCategoryExist) throw new ApiError(400, 'Kategori sudah ada')

    const newCategory = await Category.create(req.body)
    res.status(200).json({
      message: 'Kategori baru berhasil ditambahkan',
      data: newCategory
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll()
    res.status(200).json({
      data: categories
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findOne({ where: { id } })
    if (!category) throw new ApiError(404, `Category dengan id ${id} tidak ditemukan`)

    res.status(200).json({
      data: category,
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findOne({ where: { id } })
    if (!category) throw new ApiError(404, `Category dengan id ${id} tidak ditemukan`)

    await Category.update(req.body, {
      where: { id }
    })
    res.status(200).json({
      message: 'Nama kategori berhasil diubah',
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findOne({ where: { id } })
    if (!category) throw new ApiError(404, `Category dengan id ${id} tidak ditemukan`)

    await Category.destroy({
      where: { id }
    })
    res.status(200).json({
      message: 'Kategori berhasil dihapus',
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

module.exports = { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory }