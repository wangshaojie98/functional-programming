/**
 * fns顺序是从右到左执行
 * @param  {Array<function>} fns 
 * @returns {any}
 */
export const compose = (...fns) => {
  return function(val) {
    return fns.reverse().reduce((acc, fn) => {
      return fn(acc);
    }, val)
  }
}

// 如果是理科，qs*2，最后qs>20要title += qs
// 如果是英语，判断qs<5如果小于5就原样输出，否则qs = qs * 2,qs是否大于8如果大于title+8,否则title+qs

const paperInfo = [
  {
    subject: 'math',
    qs: 10,
    title: '111'
  }
]

const SCIENCES = ['math', 'physics', 'chemistry']
const isScience = subject => SCIENCES.includes(subject)
const isLt5 = val => val < 5;
const isGt8 = val => val > 8;
const isGt20 = val => val > 20;

const formatPaperInfo = (papers) => {
  return papers.map(paper => {
    let { subject = '', qs = 0, title = '' } = paper;
    if (isScience(subject)) {
      qs *= 2;

      if (isGt20(qs)) {
        title += `${qs}`
      }

    } else {
      if (!isLt5(5)) {
        qs *= 2;
      }

      if (isGt8(qs)) {
        title += '8'
      } else {
        title += `${qs}`
      }
    }

    return {
      subject,
      qs,
      title
    }
  })
}

const rules = [
  [
    ({ subject = '', qs = 0, title = '' }) => {
      return isScience(subject) && isGt20(qs * 2)
    },
    ({ subject = '', qs = 0, title = '' }) => {
      qs *= 2;
      title += `${qs}`

      return {
        subject,
        qs,
        title
      }
    }
  ],
  [
    ({ subject = '', qs = 0, title = '' }) => {
      return isScience(subject) && !isGt20(qs * 2)
    },
    ({ subject = '', qs = 0, title = '' }) => {
      qs *= 2;

      return {
        subject,
        qs,
        title
      }
    }
  ],
  [
    ({ subject = '', qs = 0, title = '' }) => {
      return !isScience(subject) && isLt5(5)
    },
    ({ subject = '', qs = 0, title = '' }) => {
      return {
        subject,
        qs,
        title
      }
    }
  ],
  [
    ({ subject = '', qs = 0, title = '' }) => {
      return !isScience(subject) && !isLt5(qs) && isGt8(qs * 2)
    },
    ({ subject = '', qs = 0, title = '' }) => {
      return {
        subject,
        qs,
        title: title += '8'
      }
    }
  ],
  [
    ({ subject = '', qs = 0, title = '' }) => {
      return !isScience(subject) && !isLt5(qs * 2) && !isGt8(tempQs)
    },
    ({ subject = '', qs = 0, title = '' }) => {
      return {
        subject,
        qs,
        title: title += qs
      }
    }
  ],
]
