import {useQuery} from 'react-query'
import {isNotEmpty, QUERIES} from '../../../../_metronic/helpers'
import {getUserById} from '../../api/_requests'
import {UserForm} from './UserForm'
import {useParams} from 'react-router-dom'
import {FC} from 'react'

type Props = {
  mode: string
}

const UserFormWrapper: FC<Props> = ({mode}) => {
  let {userId} = useParams()
  const enabledQuery: boolean = isNotEmpty(userId)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${userId}`,
    () => {
      return getUserById(userId)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        console.error(err)
      },
    }
  )

  if (!userId) {
    return <UserForm isUserLoading={isLoading} mode={mode} user={{id: undefined}} />
  }

  if (!isLoading && !error && user) {
    return <UserForm isUserLoading={isLoading} mode={mode} user={user} />
  }

  return null
}

export {UserFormWrapper}
