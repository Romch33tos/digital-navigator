const MAX_SEARCH_RESULTS = 10;
const MIN_KEYWORD_SCORE = 3;

export async function hybridSearch(vectorStore, query, k = 2) {
  const vectorResults = await vectorStore.similaritySearch(query, MAX_SEARCH_RESULTS);
  
  const keywords = query
    .toLowerCase()
    .split(/[\s,.\-!?]+/)
    .filter(word => word.length > 3);

  const scoredDocs = vectorResults.map((doc, index) => {
    const content = doc.pageContent.toLowerCase();
    
    let keywordScore = 0;
    keywords.forEach(keyword => {
      if (content.includes(keyword)) {
        keywordScore += 3;
      }
    });

    const vectorScore = (MAX_SEARCH_RESULTS - index) * 1;

    return {
      doc,
      totalScore: vectorScore + keywordScore,
      keywordScore
    };
  });

  scoredDocs.sort((a, b) => b.totalScore - a.totalScore);

  const bestDoc = scoredDocs[0];
  const resultDocs = [bestDoc.doc];

  if (scoredDocs.length > 1 && scoredDocs[1].keywordScore >= MIN_KEYWORD_SCORE) {
    resultDocs.push(scoredDocs[1].doc);
  }

  return resultDocs;
}
