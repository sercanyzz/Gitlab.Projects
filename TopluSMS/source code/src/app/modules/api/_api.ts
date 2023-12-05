import {BusinessPartner, Company, Option, UsersQueryResponse} from './_models'
import {getBusinessPartners, getUsers, searchCompanies} from './_requests'
import {Link, Pagination} from '../../../_metronic/helpers'

export const loadCompanies = (inputValue: string) =>
  new Promise<Option[]>((resolve) => {
    searchCompanies({value: inputValue}).then((response) => {
      const list: Company[] = response.content as Company[]
      console.log('list =')
      console.log(list)
      resolve(
        list.map((company) => {
          return {value: company.id?.toString(), label: company.firm} as Option
        })
      )
    })
  })

export const loadPartners = () =>
  new Promise<Option[]>((resolve) => {
    // console.log(`inputValue=${inputValue}, selectedValue=${selectedValue}`)
    // console.log(selectedValue)
    getBusinessPartners().then((response) => {
      const list: BusinessPartner[] = response.content as BusinessPartner[]
      resolve(
        list.map((bp) => {
          return {value: bp.commercialName, label: bp.commercialName}
        })
      )
    })
  })

// export const getUsersWithPagination = (query: string): Promise<UsersQueryResponse> => {
//   return getUsers(query).then((data) => {
//     if (data.content) data.content.pagination = getPagination(data)
//     return data
//   })
// }
// total page 5
// 0 123
// 1 123
// 2 234
// 3 345
// 4 345
// const getPagination = (data: UsersQueryResponse): Pagination => {
//   const {totalPages} = data
//   const {offset, pageNumber, pageSize} = data.pageable
//   const links: Array<Link> = []
//   //has first
//   if (pageNumber > 1 && totalPages > 3) {
//     links.push({label: 'First', page: 0})
//   }

//   if (pageNumber > 0) links.push({label: (pageNumber - 1).toString(), page: pageNumber - 1})
//   links.push({label: pageNumber.toString(), page: pageNumber})
//   links.push({label: (pageNumber + 1).toString(), page: pageNumber + 1})
//   links.push({label: (pageNumber + 2).toString(), page: pageNumber + 2})

//   // has last
//   if (pageNumber < totalPages - 2 && totalPages > 3) {
//     links.push({label: 'Last', page: totalPages - 1})
//   }

//   return {page: data.pageable?.pageNumber, links: links}
// }
