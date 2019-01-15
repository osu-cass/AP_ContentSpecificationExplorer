import React from 'react';
import ReactPDF, { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { IStandards } from '../../../models/target';

interface StandardsStyles {
  flexRow: object;
  flexColumnLeft: object;
  flexColumnRight: object;
  item: object;
  desc: object;
  code: object;
}

const styles: StandardsStyles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    maxHeight: '100%'
  },
  flexColumnLeft: {
    display: 'flex',
    width: '25%',
    padding: 5,
    paddingRight: 8,
    paddingTop: 10,
    borderTop: '1pt solid black',
    borderRight: '2pt solid black',
    borderBottom: '1pt solid black',
    borderLeft: '2pt solid black',
    fontSize: 12,
    textAlign: 'right'
  },
  flexColumnRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    width: '75%',
    padding: 10,
    paddingLeft: 8,
    paddingTop: 10,
    borderTop: '1pt solid black',
    borderBottom: '1pt solid black',
    borderRight: '2pt solid black',
    fontSize: 12
  },
  item: {
    display: 'flex',
    padding: '3pt',
    margin: 3
  },
  desc: {
    margin: 5
  }
}) as StandardsStyles;

export interface TargetProps {
  content: IStandards[];
}

export const Standards = ({ content }: TargetProps) => {
  return (
    <View wrap style={styles.flexRow}>
      <View style={styles.flexColumnLeft}>
        <Text>Standards</Text>
      </View>
      <View style={styles.flexColumnRight}>
        {content.map((element: IStandards) => {
          const array = element.stdCode.split('.');
          let standardShortCode: string;

          if (array[0] === 'E') {
            standardShortCode = `${array[4]}-${array[6]}`;
          } else {
            // if it is a math target
            standardShortCode = `${array[4]}.${array[5]}.${array[6]}.${array[7]}`;
          }

          return (
            <View wrap={false} style={styles.item} key={`${element.stdCode} - ${element.stdDesc}`}>
              <Text key={`${element.stdDesc}-1`}>{`${standardShortCode}: `}</Text>
              <Text key={`${element.stdCode}-2`} style={styles.desc}>
                {element.stdDesc}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
