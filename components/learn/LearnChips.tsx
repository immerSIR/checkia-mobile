import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { s } from '../../styles/learn.styles';
import { CHIPS } from '../../data/learnData';

export const LearnChips = ({ activeIndex = 0 }) => (
  <ScrollView 
    horizontal 
    showsHorizontalScrollIndicator={false} 
    style={s.chipsScroll} 
    contentContainerStyle={s.chipsRow}
  >
    {CHIPS.map((chip, i) => (
      <TouchableOpacity key={chip} style={[s.chip, i === activeIndex && s.chipActive]}>
        <Text style={[s.chipText, i === activeIndex && s.chipTextActive]}>{chip}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);