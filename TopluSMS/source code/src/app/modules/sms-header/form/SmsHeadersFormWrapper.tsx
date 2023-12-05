import {useQuery} from 'react-query'
import {isNotEmpty, QUERIES} from '../../../../_metronic/helpers'
import {getSmsHeaderById} from '../../api/_requests'
import {SmsHeaderForm} from './SmsHeaderForm'
import {useParams} from 'react-router-dom'
import {FC} from 'react'

type Props = {
  mode: string
}

export const SmsHeadersFormWrapper: FC<Props> = ({mode}) => {
  let {smsHeaderId} = useParams()
  const enabledQuery: boolean = isNotEmpty(smsHeaderId)
  const {
    isLoading,
    data: smsHeader,
    error,
  } = useQuery(
    `${QUERIES.SMS_HEADERS_LIST}-smsHeader-${smsHeaderId}`,
    () => {
      return getSmsHeaderById(smsHeaderId)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        console.error(err)
      },
    }
  )
  if (!smsHeaderId) {
    return <SmsHeaderForm isSmsHeaderLoading={isLoading} mode={mode} smsHeader={{id: undefined}} />
  }

  if (!isLoading && !error && smsHeader) {
    return <SmsHeaderForm isSmsHeaderLoading={isLoading} mode={mode} smsHeader={smsHeader} />
  }

  return null
}
