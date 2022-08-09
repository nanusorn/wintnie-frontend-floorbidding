import {
  MenuItemsType,
  TrophyIcon,
  TrophyFillIcon,
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { DropdownMenuItems } from '@pancakeswap/uikit/src/components/DropdownMenu/types'
import { ChainId } from '@pancakeswap/sdk'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean } & {
  items?: ConfigMenuDropDownItemsType[]
}

const filterItemBySupportChainId = (item, chainId) => {
  return !chainId || !item.supportChainIds ? true : item.supportChainIds?.includes(chainId)
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Games'),
      href: '/floorbidding',
      icon: TrophyIcon,
      fillIcon: TrophyFillIcon,
      supportChainIds: [ChainId.BSC],
      items: [
        {
          label: t('Floor Bidding'),
          href: '/floorbidding',
          hideSubNav: true,
        },
      ],
    },
  ].filter((item) => filterItemBySupportChainId(item, chainId))

export default config
