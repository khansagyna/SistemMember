import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export type IconName = keyof typeof Ionicons.glyphMap

type StatsCardProps = {
  title: string
  value: string | number
  icon: IconName
  color: string
}

export default function StatsCard({
  title,
  value,
  icon,
  color,
}: StatsCardProps) {

  const displayValue = value ?? '-'

  return (
    <View
      className="bg-white rounded-3xl p-4"
      style={{
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
      }}
    >
      {/* Icon */}
      <View
        className="px-1 py-1 w-11 mb-2 h-11 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${color}25`,
          width: 34,
          height: 34,
         }}
      >
        <Ionicons name={icon} size={22} color={color} />
      </View>

      {/* Value */}
      <Text
        numberOfLines={1}
        className="text-xl font-interBold text-gray-900"
      >
        {displayValue}
      </Text>

      {/* Title */}
      <Text
        numberOfLines={1}
        className="font-inter text-sm text-gray-600"
      >
        {title}
      </Text>
    </View>
  )
}