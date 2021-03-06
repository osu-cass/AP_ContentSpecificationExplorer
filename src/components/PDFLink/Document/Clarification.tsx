import React from 'react';
// import '../../../../node_modules/typeface-pt-serif/index.css';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { ITarget } from '../../../models/target';
import { styles } from './styles';
import { parsePdfContent } from './utils';

export interface ItemRow {
  title: string;
  description: string;
}

export interface TargetProps {
  content: ITarget;
}

export const Clarification = ({ content }: TargetProps) => {
  return (
    <View style={styles.flexRow}>
      <View style={styles.flexColumnLeft}>
        <Text>Clarifications</Text>
      </View>
      <View style={styles.flexColumnRight}>{parsePdfContent(content.clarification)}</View>
    </View>
  );
};
