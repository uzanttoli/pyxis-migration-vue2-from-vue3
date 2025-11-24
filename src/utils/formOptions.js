import FormOptionsService from '@/data/services/formOptions/formOptions'

async function loadFormOptions(form, field, propertyName, context) {
  context[propertyName] = []
  const response = await FormOptionsService.getByField(form, field)
  context[propertyName] = response
}

async function loadFormOptionsParent(form, field, parent, parentValue, propertyName, context) {
  context[propertyName] = []
  const response = await FormOptionsService.getByParent(form, field, parent, parentValue)
  context[propertyName] = response
}

export { loadFormOptions, loadFormOptionsParent }
