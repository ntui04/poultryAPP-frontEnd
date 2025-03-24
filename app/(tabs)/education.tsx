// import { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';
// import { router } from 'expo-router';
// import { Search, BookOpen, CirclePlay as PlayCircle } from 'lucide-react-native';

// export default function Education() {
//   const [searchQuery, setSearchQuery] = useState('');

//   const featuredCourses = [
//     {
//       id: '1',
//       title: 'Poultry Health Management',
//       instructor: 'Dr. Sarah Wilson',
//       duration: '4 weeks',
//       image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c',
//       rating: 4.8,
//     },
//     {
//       id: '2',
//       title: 'Feed Formulation Basics',
//       instructor: 'Prof. John Carter',
//       duration: '3 weeks',
//       image: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc',
//       rating: 4.6,
//     },
//   ];

//   const articles = [
//     {
//       id: '1',
//       title: 'Common Diseases in Layer Chickens',
//       author: 'Dr. Emily Brown',
//       readTime: '5 min read',
//       image: 'https://images.unsplash.com/photo-1569597967185-cd6120712154',
//     },
//     {
//       id: '2',
//       title: 'Optimizing Broiler Production',
//       author: 'James Wilson',
//       readTime: '8 min read',
//       image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c',
//     },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Learn & Grow</Text>
//         <View style={styles.searchContainer}>
//           <Search size={20} color="#64748b" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search courses and articles..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Featured Courses</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {featuredCourses.map((course) => (
//             <Pressable
//               key={course.id}
//               style={styles.courseCard}
//               onPress={() => router.push(`/course/${course.id}`)}>
//               <Image source={{ uri: course.image }} style={styles.courseImage} />
//               <View style={styles.courseInfo}>
//                 <Text style={styles.courseTitle}>{course.title}</Text>
//                 <Text style={styles.instructor}>{course.instructor}</Text>
//                 <View style={styles.courseMeta}>
//                   <View style={styles.duration}>
//                     <PlayCircle size={16} color="#64748b" />
//                     <Text style={styles.durationText}>{course.duration}</Text>
//                   </View>
//                   <Text style={styles.rating}>★ {course.rating}</Text>
//                 </View>
//               </View>
//             </Pressable>
//           ))}
//         </ScrollView>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Latest Articles</Text>
//         {articles.map((article) => (
//           <Pressable
//             key={article.id}
//             style={styles.articleCard}
//             onPress={() => router.push(`/article/${article.id}`)}>
//             <Image source={{ uri: article.image }} style={styles.articleImage} />
//             <View style={styles.articleInfo}>
//               <Text style={styles.articleTitle}>{article.title}</Text>
//               <Text style={styles.articleAuthor}>{article.author}</Text>
//               <View style={styles.articleMeta}>
//                 <BookOpen size={16} color="#64748b" />
//                 <Text style={styles.readTime}>{article.readTime}</Text>
//               </View>
//             </View>
//           </Pressable>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },
//   header: {
//     padding: 24,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f1f5f9',
//     borderRadius: 8,
//     padding: 12,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#1f2937',
//   },
//   section: {
//     padding: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1f2937',
//     marginBottom: 16,
//   },
//   courseCard: {
//     width: 280,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginRight: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   courseImage: {
//     width: '100%',
//     height: 160,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   courseInfo: {
//     padding: 16,
//   },
//   courseTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1f2937',
//   },
//   instructor: {
//     fontSize: 14,
//     color: '#64748b',
//     marginTop: 4,
//   },
//   courseMeta: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   duration: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   durationText: {
//     marginLeft: 4,
//     fontSize: 14,
//     color: '#64748b',
//   },
//   rating: {
//     fontSize: 14,
//     color: '#eab308',
//     fontWeight: '500',
//   },
//   articleCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   articleImage: {
//     width: 100,
//     height: 100,
//     borderTopLeftRadius: 12,
//     borderBottomLeftRadius: 12,
//   },
//   articleInfo: {
//     flex: 1,
//     padding: 16,
//   },
//   articleTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1f2937',
//   },
//   articleAuthor: {
//     fontSize: 14,
//     color: '#64748b',
//     marginTop: 4,
//   },
//   articleMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   readTime: {
//     marginLeft: 4,
//     fontSize: 14,
//     color: '#64748b',
//   },
// });