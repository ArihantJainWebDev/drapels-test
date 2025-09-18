import React from "react";

export interface DSAProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  companies: string[];
  leetcodeUrl: string;
  description: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  pattern: string;
  completed: boolean;
  bookmarked: boolean;
  notes: string;
  solution: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  hints: string[];
}

export const dsaProblems: DSAProblem[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Table"],
    companies: ["Amazon", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    approach:
      "Use hash map to store complements and find the pair in single pass",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "Hash Table",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
      python: `def twoSum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        
        map.put(nums[i], i);
    }
    
    return new int[0];
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (mp.find(complement) != mp.end()) {
            return {mp[complement], i};
        }
        
        mp[nums[i]] = i;
    }
    
    return {};
}`,
    },
    hints: [
      "Think about using a hash table to store numbers you've seen",
      "For each number, calculate what its pair should be",
      "Check if the pair exists in your hash table",
    ],
  },
  {
    id: "2",
    title: "Merge Intervals",
    difficulty: "Medium",
    topics: ["Array", "Sorting"],
    companies: ["Google", "Uber"],
    leetcodeUrl: "https://leetcode.com/problems/merge-intervals/",
    description:
      "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    approach: "Sort intervals by start time, then merge overlapping ones",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    pattern: "Sorting",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function merge(intervals) {
    if (intervals.length <= 1) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    const result = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = result[result.length - 1];
        
        if (current[0] <= lastMerged[1]) {
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            result.push(current);
        }
    }
    
    return result;
}`,
      python: `def merge(intervals):
    if len(intervals) <= 1:
        return intervals
    
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]
    
    for current in intervals[1:]:
        last_merged = result[-1]
        
        if current[0] <= last_merged[1]:
            last_merged[1] = max(last_merged[1], current[1])
        else:
            result.append(current)
    
    return result`,
      java: `public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> result = new ArrayList<>();
    result.add(intervals[0]);
    
    for (int i = 1; i < intervals.length; i++) {
        int[] current = intervals[i];
        int[] lastMerged = result.get(result.size() - 1);
        
        if (current[0] <= lastMerged[1]) {
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            result.add(current);
        }
    }
    
    return result.toArray(new int[result.size()][]);
}`,
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    if (intervals.size() <= 1) return intervals;
    
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> result;
    result.push_back(intervals[0]);
    
    for (int i = 1; i < intervals.size(); i++) {
        vector<int> current = intervals[i];
        vector<int>& lastMerged = result.back();
        
        if (current[0] <= lastMerged[1]) {
            lastMerged[1] = max(lastMerged[1], current[1]);
        } else {
            result.push_back(current);
        }
    }
    
    return result;
}`,
    },
    hints: [
      "Sort the intervals by their start times first",
      "Iterate through sorted intervals and merge overlapping ones",
      "Two intervals overlap if start of current <= end of previous",
    ],
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["String", "Sliding Window", "Hash Table"],
    companies: ["Adobe", "Paytm"],
    leetcodeUrl:
      "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    approach: "Use sliding window technique with hash set to track characters",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))",
    pattern: "Sliding Window",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function lengthOfLongestSubstring(s) {
    const charSet = new Set();
    let left = 0, maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
      python: `def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
      java: `public int lengthOfLongestSubstring(String s) {
    Set<Character> charSet = new HashSet<>();
    int left = 0, maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        while (charSet.contains(s.charAt(right))) {
            charSet.remove(s.charAt(left));
            left++;
        }
        charSet.add(s.charAt(right));
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
      cpp: `int lengthOfLongestSubstring(string s) {
    unordered_set<char> charSet;
    int left = 0, maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        while (charSet.count(s[right])) {
            charSet.erase(s[left]);
            left++;
        }
        charSet.insert(s[right]);
        maxLength = max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
    },
    hints: [
      "Use sliding window with two pointers",
      "Maintain a set of characters in current window",
      "When duplicate found, shrink window from left",
    ],
  },
  {
    id: "4",
    title: "Reverse Linked List",
    difficulty: "Easy",
    topics: ["Linked List"],
    companies: ["TCS", "Wipro"],
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    approach: "Use iterative approach with three pointers: prev, current, next",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Linked List",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current) {
        let next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
      python: `def reverseList(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev`,
      java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        ListNode next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    
    while (current != nullptr) {
        ListNode* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
    },
    hints: [
      "Use three pointers: previous, current, and next",
      "Reverse the link direction in each iteration",
      "Handle the edge case of empty list",
    ],
  },
  {
    id: "5",
    title: "Detect Cycle in a Linked List",
    difficulty: "Easy",
    topics: ["Linked List", "Two Pointers"],
    companies: ["Accenture", "Infosys"],
    leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/",
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    approach: "Floyd's Cycle Detection Algorithm (Tortoise and Hare)",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Two Pointers",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function hasCycle(head) {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            return true;
        }
    }
    
    return false;
}`,
      python: `def hasCycle(head):
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False`,
      java: `public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) return false;
    
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow == fast) {
            return true;
        }
    }
    
    return false;
}`,
      cpp: `bool hasCycle(ListNode *head) {
    if (!head || !head->next) return false;
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            return true;
        }
    }
    
    return false;
}`,
    },
    hints: [
      "Use Floyd's cycle detection algorithm",
      "Slow pointer moves one step, fast pointer moves two steps",
      "If there's a cycle, they will eventually meet",
    ],
  },
  {
    id: "6",
    title: "Minimum Number of Platforms Required",
    difficulty: "Medium",
    topics: ["Array", "Sorting", "Greedy"],
    companies: ["TCS", "Capgemini"],
    leetcodeUrl:
      "https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1",
    description:
      "Given arrival and departure times of all trains that reach a railway station, find minimum number of platforms required for the railway station so that no train waits.",
    approach:
      "Sort arrival and departure times separately, use two pointers to count overlaps",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    pattern: "Greedy",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function findPlatform(arr, dep, n) {
    arr.sort((a, b) => a - b);
    dep.sort((a, b) => a - b);
    
    let platforms = 1;
    let maxPlatforms = 1;
    let i = 1, j = 0;
    
    while (i < n && j < n) {
        if (arr[i] <= dep[j]) {
            platforms++;
            i++;
        } else {
            platforms--;
            j++;
        }
        maxPlatforms = Math.max(maxPlatforms, platforms);
    }
    
    return maxPlatforms;
}`,
      python: `def findPlatform(arr, dep, n):
    arr.sort()
    dep.sort()
    
    platforms = 1
    max_platforms = 1
    i, j = 1, 0
    
    while i < n and j < n:
        if arr[i] <= dep[j]:
            platforms += 1
            i += 1
        else:
            platforms -= 1
            j += 1
        max_platforms = max(max_platforms, platforms)
    
    return max_platforms`,
      java: `static int findPlatform(int arr[], int dep[], int n) {
    Arrays.sort(arr);
    Arrays.sort(dep);
    
    int platforms = 1;
    int maxPlatforms = 1;
    int i = 1, j = 0;
    
    while (i < n && j < n) {
        if (arr[i] <= dep[j]) {
            platforms++;
            i++;
        } else {
            platforms--;
            j++;
        }
        maxPlatforms = Math.max(maxPlatforms, platforms);
    }
    
    return maxPlatforms;
}`,
      cpp: `int findPlatform(int arr[], int dep[], int n) {
    sort(arr, arr + n);
    sort(dep, dep + n);
    
    int platforms = 1;
    int maxPlatforms = 1;
    int i = 1, j = 0;
    
    while (i < n && j < n) {
        if (arr[i] <= dep[j]) {
            platforms++;
            i++;
        } else {
            platforms--;
            j++;
        }
        maxPlatforms = max(maxPlatforms, platforms);
    }
    
    return maxPlatforms;
}`,
    },
    hints: [
      "Sort both arrival and departure times separately",
      "Use two pointers to traverse both arrays",
      "Track the maximum number of overlapping intervals",
    ],
  },
  {
    id: "7",
    title: "Kth Largest Element in Array",
    difficulty: "Medium",
    topics: ["Array", "Divide and Conquer", "Sorting", "Heap"],
    companies: ["Zomato", "Flipkart"],
    leetcodeUrl:
      "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    description:
      "Given an integer array nums and an integer k, return the kth largest element in the array.",
    approach: "Use quickselect algorithm or min heap of size k",
    timeComplexity: "O(n) average, O(n²) worst case",
    spaceComplexity: "O(1)",
    pattern: "Divide and Conquer",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function findKthLargest(nums, k) {
    function quickSelect(left, right, k) {
        if (left === right) return nums[left];
        
        const pivotIndex = partition(left, right);
        
        if (k === pivotIndex) return nums[k];
        else if (k < pivotIndex) return quickSelect(left, pivotIndex - 1, k);
        else return quickSelect(pivotIndex + 1, right, k);
    }
    
    function partition(left, right) {
        const pivot = nums[right];
        let i = left;
        
        for (let j = left; j < right; j++) {
            if (nums[j] >= pivot) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
                i++;
            }
        }
        [nums[i], nums[right]] = [nums[right], nums[i]];
        return i;
    }
    
    return quickSelect(0, nums.length - 1, k - 1);
}`,
      python: `def findKthLargest(nums, k):
    def quickSelect(left, right, k):
        if left == right:
            return nums[left]
        
        pivot_index = partition(left, right)
        
        if k == pivot_index:
            return nums[k]
        elif k < pivot_index:
            return quickSelect(left, pivot_index - 1, k)
        else:
            return quickSelect(pivot_index + 1, right, k)
    
    def partition(left, right):
        pivot = nums[right]
        i = left
        
        for j in range(left, right):
            if nums[j] >= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        
        nums[i], nums[right] = nums[right], nums[i]
        return i
    
    return quickSelect(0, len(nums) - 1, k - 1)`,
      java: `public int findKthLargest(int[] nums, int k) {
    return quickSelect(nums, 0, nums.length - 1, k - 1);
}

private int quickSelect(int[] nums, int left, int right, int k) {
    if (left == right) return nums[left];
    
    int pivotIndex = partition(nums, left, right);
    
    if (k == pivotIndex) return nums[k];
    else if (k < pivotIndex) return quickSelect(nums, left, pivotIndex - 1, k);
    else return quickSelect(nums, pivotIndex + 1, right, k);
}

private int partition(int[] nums, int left, int right) {
    int pivot = nums[right];
    int i = left;
    
    for (int j = left; j < right; j++) {
        if (nums[j] >= pivot) {
            swap(nums, i, j);
            i++;
        }
    }
    swap(nums, i, right);
    return i;
}`,
      cpp: `int findKthLargest(vector<int>& nums, int k) {
    return quickSelect(nums, 0, nums.size() - 1, k - 1);
}

int quickSelect(vector<int>& nums, int left, int right, int k) {
    if (left == right) return nums[left];
    
    int pivotIndex = partition(nums, left, right);
    
    if (k == pivotIndex) return nums[k];
    else if (k < pivotIndex) return quickSelect(nums, left, pivotIndex - 1, k);
    else return quickSelect(nums, pivotIndex + 1, right, k);
}

int partition(vector<int>& nums, int left, int right) {
    int pivot = nums[right];
    int i = left;
    
    for (int j = left; j < right; j++) {
        if (nums[j] >= pivot) {
            swap(nums[i], nums[j]);
            i++;
        }
    }
    swap(nums[i], nums[right]);
    return i;
}`,
    },
    hints: [
      "Consider using quickselect algorithm for O(n) average time",
      "Alternatively, use a min heap of size k",
      "Sort in descending order for easier indexing",
    ],
  },
  {
    id: "8",
    title: "Rotate Matrix (90 degrees)",
    difficulty: "Medium",
    topics: ["Array", "Math", "Matrix"],
    companies: ["Ola", "Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/rotate-image/",
    description:
      "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
    approach: "Transpose the matrix, then reverse each row",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    pattern: "Matrix",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function rotate(matrix) {
    const n = matrix.length;
    
    // Transpose the matrix
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    // Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
}`,
      python: `def rotate(matrix):
    n = len(matrix)
    
    # Transpose the matrix
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Reverse each row
    for i in range(n):
        matrix[i].reverse()`,
      java: `public void rotate(int[][] matrix) {
    int n = matrix.length;
    
    // Transpose the matrix
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    
    // Reverse each row
    for (int i = 0; i < n; i++) {
        int left = 0, right = n - 1;
        while (left < right) {
            int temp = matrix[i][left];
            matrix[i][left] = matrix[i][right];
            matrix[i][right] = temp;
            left++;
            right--;
        }
    }
}`,
      cpp: `void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    
    // Transpose the matrix
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }
    
    // Reverse each row
    for (int i = 0; i < n; i++) {
        reverse(matrix[i].begin(), matrix[i].end());
    }
}`,
    },
    hints: [
      "Two-step approach: transpose then reverse rows",
      "Transpose means swap matrix[i][j] with matrix[j][i]",
      "Reverse each row to complete the 90-degree rotation",
    ],
  },
  {
    id: "9",
    title: "Stock Buy and Sell (Best Time)",
    difficulty: "Easy",
    topics: ["Array", "Dynamic Programming"],
    companies: ["PhonePe", "Zerodha"],
    leetcodeUrl:
      "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    approach: "Keep track of minimum price seen so far and maximum profit",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Dynamic Programming",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (let price of prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    
    return maxProfit;
}`,
      python: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    
    return max_profit`,
      java: `public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;
    
    for (int price : prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    
    return maxProfit;
}`,
      cpp: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX;
    int maxProfit = 0;
    
    for (int price : prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    
    return maxProfit;
}`,
    },
    hints: [
      "Track the minimum price seen so far",
      "Calculate profit at each step and keep track of maximum",
      "You can only sell after you buy",
    ],
  },
  {
    id: "10",
    title: "LRU Cache Implementation",
    difficulty: "Medium",
    topics: ["Hash Table", "Linked List", "Design"],
    companies: ["Google", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/lru-cache/",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    approach: "Use hash map + doubly linked list for O(1) operations",
    timeComplexity: "O(1)",
    spaceComplexity: "O(capacity)",
    pattern: "Design",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        
        // Create dummy head and tail nodes
        this.head = { key: 0, val: 0, prev: null, next: null };
        this.tail = { key: 0, val: 0, prev: null, next: null };
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    
    get(key) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            this.moveToHead(node);
            return node.val;
        }
        return -1;
    }
    
    put(key, value) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            node.val = value;
            this.moveToHead(node);
        } else {
            const newNode = { key, val: value, prev: null, next: null };
            
            if (this.cache.size >= this.capacity) {
                const tail = this.removeTail();
                this.cache.delete(tail.key);
            }
            
            this.cache.set(key, newNode);
            this.addToHead(newNode);
        }
    }
    
    addToHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }
    
    removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    
    moveToHead(node) {
        this.removeNode(node);
        this.addToHead(node);
    }
    
    removeTail() {
        const lastNode = this.tail.prev;
        this.removeNode(lastNode);
        return lastNode;
    }
}`,
      python: `class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        
        # Create dummy head and tail nodes
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def get(self, key):
        if key in self.cache:
            node = self.cache[key]
            self._move_to_head(node)
            return node.val
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_head(node)
        else:
            new_node = Node(key, value)
            
            if len(self.cache) >= self.capacity:
                tail = self._remove_tail()
                del self.cache[tail.key]
            
            self.cache[key] = new_node
            self._add_to_head(new_node)
    
    def _add_to_head(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _remove_node(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _move_to_head(self, node):
        self._remove_node(node)
        self._add_to_head(node)
    
    def _remove_tail(self):
        last_node = self.tail.prev
        self._remove_node(last_node)
        return last_node

class Node:
    def __init__(self, key, val):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None`,
      java: `class LRUCache {
    private Map<Integer, Node> cache;
    private int capacity;
    private Node head, tail;
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();
        
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }
    
    public int get(int key) {
        if (cache.containsKey(key)) {
            Node node = cache.get(key);
            moveToHead(node);
            return node.val;
        }
        return -1;
    }
    
    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            Node node = cache.get(key);
            node.val = value;
            moveToHead(node);
        } else {
            Node newNode = new Node(key, value);
            
            if (cache.size() >= capacity) {
                Node tail = removeTail();
                cache.remove(tail.key);
            }
            
            cache.put(key, newNode);
            addToHead(newNode);
        }
    }
    
    private void addToHead(Node node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }
    
    private void removeNode(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    
    private void moveToHead(Node node) {
        removeNode(node);
        addToHead(node);
    }
    
    private Node removeTail() {
        Node lastNode = tail.prev;
        removeNode(lastNode);
        return lastNode;
    }
    
    class Node {
        int key, val;
        Node prev, next;
        
        Node(int key, int val) {
            this.key = key;
            this.val = val;
        }
    }
}`,
      cpp: `class LRUCache {
private:
    struct Node {
        int key, val;
        Node* prev;
        Node* next;
        Node(int k, int v) : key(k), val(v), prev(nullptr), next(nullptr) {}
    };
    
    unordered_map<int, Node*> cache;
    int capacity;
    Node* head;
    Node* tail;
    
    void addToHead(Node* node) {
        node->prev = head;
        node->next = head->next;
        head->next->prev = node;
        head->next = node;
    }
    
    void removeNode(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }
    
    void moveToHead(Node* node) {
        removeNode(node);
        addToHead(node);
    }
    
    Node* removeTail() {
        Node* lastNode = tail->prev;
        removeNode(lastNode);
        return lastNode;
    }
    
public:
    LRUCache(int capacity) : capacity(capacity) {
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head->next = tail;
        tail->prev = head;
    }
    
    int get(int key) {
        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            moveToHead(node);
            return node->val;
        }
        return -1;
    }
    
    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            node->val = value;
            moveToHead(node);
        } else {
            Node* newNode = new Node(key, value);
            
            if (cache.size() >= capacity) {
                Node* tail = removeTail();
                cache.erase(tail->key);
                delete tail;
            }
            
            cache[key] = newNode;
            addToHead(newNode);
        }
    }
}`,
    },
    hints: [
      "Combine hash map for O(1) lookup with doubly linked list for O(1) insertion/deletion",
      "Most recently used items should be at the head of the list",
      "Use dummy head and tail nodes to simplify edge cases",
    ],
  },
  {
    id: "11",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["String", "Stack"],
    companies: ["Wipro", "Cognizant"],
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    approach:
      "Use stack to track opening brackets and match with closing brackets",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "Stack",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function isValid(s) {
    const stack = [];
    const mapping = {')': '(', '}': '{', ']': '['};
    
    for (let char of s) {
        if (mapping[char]) {
            if (stack.pop() !== mapping[char]) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}`,
      python: `def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return len(stack) == 0`,
      java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put('}', '{');
    mapping.put(']', '[');
    
    for (char c : s.toCharArray()) {
        if (mapping.containsKey(c)) {
            if (stack.isEmpty() || stack.pop() != mapping.get(c)) {
                return false;
            }
        } else {
            stack.push(c);
        }
    }
    
    return stack.isEmpty();
}`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> mapping = {
        {')', '('},
        {'}', '{'},
        {']', '['}
    };
    
    for (char c : s) {
        if (mapping.find(c) != mapping.end()) {
            if (st.empty() || st.top() != mapping[c]) {
                return false;
            }
            st.pop();
        } else {
            st.push(c);
        }
    }
    
    return st.empty();
}`,
    },
    hints: [
      "Stack is perfect for this problem - LIFO (Last In, First Out)",
      "Push opening brackets onto stack",
      "When you see closing bracket, check if it matches the top of stack",
    ],
  },
  {
    id: "12",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topics: ["Array", "Binary Search", "Divide and Conquer"],
    companies: ["Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    description:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    approach:
      "Use binary search to partition arrays such that left half has same elements as right half",
    timeComplexity: "O(log(min(m,n)))",
    spaceComplexity: "O(1)",
    pattern: "Binary Search",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }
    
    const m = nums1.length;
    const n = nums2.length;
    let low = 0, high = m;
    
    while (low <= high) {
        const cut1 = Math.floor((low + high) / 2);
        const cut2 = Math.floor((m + n + 1) / 2) - cut1;
        
        const left1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];
        const left2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];
        const right1 = cut1 === m ? Infinity : nums1[cut1];
        const right2 = cut2 === n ? Infinity : nums2[cut2];
        
        if (left1 <= right2 && left2 <= right1) {
            if ((m + n) % 2 === 0) {
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
            } else {
                return Math.max(left1, left2);
            }
        } else if (left1 > right2) {
            high = cut1 - 1;
        } else {
            low = cut1 + 1;
        }
    }
}`,
      python: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    low, high = 0, m
    
    while low <= high:
        cut1 = (low + high) // 2
        cut2 = (m + n + 1) // 2 - cut1
        
        left1 = float('-inf') if cut1 == 0 else nums1[cut1 - 1]
        left2 = float('-inf') if cut2 == 0 else nums2[cut2 - 1]
        right1 = float('inf') if cut1 == m else nums1[cut1]
        right2 = float('inf') if cut2 == n else nums2[cut2]
        
        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 0:
                return (max(left1, left2) + min(right1, right2)) / 2
            else:
                return max(left1, left2)
        elif left1 > right2:
            high = cut1 - 1
        else:
            low = cut1 + 1`,
      java: `public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    if (nums1.length > nums2.length) {
        int[] temp = nums1;
        nums1 = nums2;
        nums2 = temp;
    }
    
    int m = nums1.length, n = nums2.length;
    int low = 0, high = m;
    
    while (low <= high) {
        int cut1 = (low + high) / 2;
        int cut2 = (m + n + 1) / 2 - cut1;
        
        int left1 = cut1 == 0 ? Integer.MIN_VALUE : nums1[cut1 - 1];
        int left2 = cut2 == 0 ? Integer.MIN_VALUE : nums2[cut2 - 1];
        int right1 = cut1 == m ? Integer.MAX_VALUE : nums1[cut1];
        int right2 = cut2 == n ? Integer.MAX_VALUE : nums2[cut2];
        
        if (left1 <= right2 && left2 <= right1) {
            if ((m + n) % 2 == 0) {
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2.0;
            } else {
                return Math.max(left1, left2);
            }
        } else if (left1 > right2) {
            high = cut1 - 1;
        } else {
            low = cut1 + 1;
        }
    }
    
    return 0.0;
}`,
      cpp: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) {
        swap(nums1, nums2);
    }
    
    int m = nums1.size(), n = nums2.size();
    int low = 0, high = m;
    
    while (low <= high) {
        int cut1 = (low + high) / 2;
        int cut2 = (m + n + 1) / 2 - cut1;
        
        int left1 = cut1 == 0 ? INT_MIN : nums1[cut1 - 1];
        int left2 = cut2 == 0 ? INT_MIN : nums2[cut2 - 1];
        int right1 = cut1 == m ? INT_MAX : nums1[cut1];
        int right2 = cut2 == n ? INT_MAX : nums2[cut2];
        
        if (left1 <= right2 && left2 <= right1) {
            if ((m + n) % 2 == 0) {
                return (max(left1, left2) + min(right1, right2)) / 2.0;
            } else {
                return max(left1, left2);
            }
        } else if (left1 > right2) {
            high = cut1 - 1;
        } else {
            low = cut1 + 1;
        }
    }
    
    return 0.0;
}`,
    },
    hints: [
      "Use binary search on the smaller array",
      "Partition both arrays such that left half has same number of elements as right half",
      "Ensure all elements in left half are smaller than elements in right half",
    ],
  },
  {
    id: "13",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    topics: ["Array", "Queue", "Sliding Window", "Heap", "Monotonic Queue"],
    companies: ["DE Shaw"],
    leetcodeUrl: "https://leetcode.com/problems/sliding-window-maximum/",
    description:
      "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.",
    approach:
      "Use deque to maintain elements in decreasing order within window",
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    pattern: "Sliding Window",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = []; // stores indices
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside current window
        while (deque.length && deque[0] < i - k + 1) {
            deque.shift();
        }
        
        // Remove indices whose corresponding values are smaller than current
        while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }
        
        deque.push(i);
        
        // Add to result if window size reached
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}`,
      python: `def maxSlidingWindow(nums, k):
    from collections import deque
    
    result = []
    dq = deque()  # stores indices
    
    for i in range(len(nums)):
        # Remove indices outside current window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove indices whose values are smaller than current
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # Add to result if window size reached
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result`,
      java: `public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> deque = new ArrayDeque<>();
    
    for (int i = 0; i < n; i++) {
        // Remove indices outside current window
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.pollFirst();
        }
        
        // Remove indices whose values are smaller than current
        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
            deque.pollLast();
        }
        
        deque.offerLast(i);
        
        // Add to result if window size reached
        if (i >= k - 1) {
            result[i - k + 1] = nums[deque.peekFirst()];
        }
    }
    
    return result;
}`,
      cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    vector<int> result;
    deque<int> dq; // stores indices
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove indices outside current window
        while (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }
        
        // Remove indices whose values are smaller than current
        while (!dq.empty() && nums[dq.back()] < nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        // Add to result if window size reached
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    
    return result;
}`,
    },
    hints: [
      "Use a deque to maintain indices in decreasing order of their values",
      "Remove indices outside the current window",
      "The front of deque always contains the index of maximum element in current window",
    ],
  },
  {
    id: "14",
    title: "Clone a Graph",
    difficulty: "Medium",
    topics: [
      "Hash Table",
      "Depth-First Search",
      "Breadth-First Search",
      "Graph",
    ],
    companies: ["Atlassian"],
    leetcodeUrl: "https://leetcode.com/problems/clone-graph/",
    description:
      "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.",
    approach:
      "Use DFS/BFS with hash map to track visited nodes and their clones",
    timeComplexity: "O(N + M)",
    spaceComplexity: "O(N)",
    pattern: "Graph Traversal",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function cloneGraph(node) {
    if (!node) return null;
    
    const visited = new Map();
    
    function dfs(node) {
        if (visited.has(node)) {
            return visited.get(node);
        }
        
        const clone = new Node(node.val);
        visited.set(node, clone);
        
        for (let neighbor of node.neighbors) {
            clone.neighbors.push(dfs(neighbor));
        }
        
        return clone;
    }
    
    return dfs(node);
}`,
      python: `def cloneGraph(node):
    if not node:
        return None
    
    visited = {}
    
    def dfs(node):
        if node in visited:
            return visited[node]
        
        clone = Node(node.val)
        visited[node] = clone
        
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)`,
      java: `public Node cloneGraph(Node node) {
    if (node == null) return null;
    
    Map<Node, Node> visited = new HashMap<>();
    return dfs(node, visited);
}

private Node dfs(Node node, Map<Node, Node> visited) {
    if (visited.containsKey(node)) {
        return visited.get(node);
    }
    
    Node clone = new Node(node.val);
    visited.put(node, clone);
    
    for (Node neighbor : node.neighbors) {
        clone.neighbors.add(dfs(neighbor, visited));
    }
    
    return clone;
}`,
      cpp: `Node* cloneGraph(Node* node) {
    if (!node) return nullptr;
    
    unordered_map<Node*, Node*> visited;
    return dfs(node, visited);
}

Node* dfs(Node* node, unordered_map<Node*, Node*>& visited) {
    if (visited.find(node) != visited.end()) {
        return visited[node];
    }
    
    Node* clone = new Node(node->val);
    visited[node] = clone;
    
    for (Node* neighbor : node->neighbors) {
        clone->neighbors.push_back(dfs(neighbor, visited));
    }
    
    return clone;
}`,
    },
    hints: [
      "Use DFS or BFS to traverse the graph",
      "Maintain a hash map to track visited nodes and their clones",
      "Clone the node first, then recursively clone its neighbors",
    ],
  },
  {
    id: "15",
    title: "Word Break Problem",
    difficulty: "Medium",
    topics: ["Hash Table", "String", "Dynamic Programming", "Trie"],
    companies: ["TCS", "Capgemini"],
    leetcodeUrl: "https://leetcode.com/problems/word-break/",
    description:
      "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    approach:
      "Use dynamic programming to check if substring can be formed using dictionary words",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    pattern: "Dynamic Programming",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function wordBreak(s, wordDict) {
    const wordSet = new Set(wordDict);
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true;
    
    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[s.length];
}`,
      python: `def wordBreak(s, wordDict):
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[len(s)]`,
      java: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;
    
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[s.length()];
}`,
      cpp: `bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
    vector<bool> dp(s.length() + 1, false);
    dp[0] = true;
    
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.count(s.substr(j, i - j))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[s.length()];
}`,
    },
    hints: [
      "Use dynamic programming where dp[i] represents if s[0...i-1] can be segmented",
      "For each position i, check all possible previous positions j",
      "If dp[j] is true and s[j...i-1] is in dictionary, then dp[i] is true",
    ],
  },
  {
    id: "16",
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Medium",
    topics: ["Array", "Dynamic Programming", "Divide and Conquer"],
    companies: ["Zomato", "Goldman Sachs"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    approach:
      "Kadane's algorithm - keep track of maximum sum ending at current position",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Dynamic Programming",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
      python: `def maxSubArray(nums):
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
      java: `public int maxSubArray(int[] nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
      cpp: `int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
    },
    hints: [
      "This is a classic dynamic programming problem",
      "At each position, decide whether to start a new subarray or extend the current one",
      "Kadane's algorithm is the optimal approach",
    ],
  },
  {
    id: "17",
    title: "Find All Duplicates in Array",
    difficulty: "Medium",
    topics: ["Array", "Hash Table"],
    companies: ["Swiggy"],
    leetcodeUrl:
      "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
    description:
      "Given an integer array nums of length n where all the integers of nums are in the range [1, n] and each integer appears once or twice, return an array of all the integers that appears twice.",
    approach:
      "Use array indices as hash map by negating values at corresponding indices",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Array",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function findDuplicates(nums) {
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        const index = Math.abs(nums[i]) - 1;
        
        if (nums[index] < 0) {
            result.push(Math.abs(nums[i]));
        } else {
            nums[index] = -nums[index];
        }
    }
    
    return result;
}`,
      python: `def findDuplicates(nums):
    result = []
    
    for i in range(len(nums)):
        index = abs(nums[i]) - 1
        
        if nums[index] < 0:
            result.append(abs(nums[i]))
        else:
            nums[index] = -nums[index]
    
    return result`,
      java: `public List<Integer> findDuplicates(int[] nums) {
    List<Integer> result = new ArrayList<>();
    
    for (int i = 0; i < nums.length; i++) {
        int index = Math.abs(nums[i]) - 1;
        
        if (nums[index] < 0) {
            result.add(Math.abs(nums[i]));
        } else {
            nums[index] = -nums[index];
        }
    }
    
    return result;
}`,
      cpp: `vector<int> findDuplicates(vector<int>& nums) {
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        int index = abs(nums[i]) - 1;
        
        if (nums[index] < 0) {
            result.push_back(abs(nums[i]));
        } else {
            nums[index] = -nums[index];
        }
    }
    
    return result;
}`,
    },
    hints: [
      "Use the constraint that all numbers are in range [1, n]",
      "Use array indices as hash map by negating values",
      "If value at index is already negative, it means we've seen this number before",
    ],
  },
  {
    id: "18",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topics: ["Tree", "Breadth-First Search"],
    companies: ["Infosys", "IBM"],
    leetcodeUrl:
      "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    approach: "Use BFS with queue to traverse level by level",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "Tree Traversal",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}`,
      python: `def levelOrder(root):
    if not root:
        return []
    
    result = []
    queue = [root]
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.pop(0)
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result`,
      java: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> currentLevel = new ArrayList<>();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            currentLevel.add(node.val);
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        
        result.add(currentLevel);
    }
    
    return result;
}`,
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> currentLevel;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            currentLevel.push_back(node->val);
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        result.push_back(currentLevel);
    }
    
    return result;
}`,
    },
    hints: [
      "Use BFS (Breadth-First Search) with a queue",
      "Process nodes level by level using queue size",
      "Add all nodes of current level to result before moving to next level",
    ],
  },
  {
    id: "19",
    title: "Flatten Binary Tree to Linked List",
    difficulty: "Medium",
    topics: ["Binary Tree", "DFS", "Recursion"],
    companies: ["Adobe"],
    leetcodeUrl:
      "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
    description:
      "Given the root of a binary tree, flatten the tree into a 'linked list' in-place following the preorder traversal order.",
    approach:
      "Use reverse preorder traversal (right -> left -> root) with a prev pointer to rearrange pointers in-place.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    pattern: "Tree DFS",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `var flatten = function(root) {
    let prev = null;
    const helper = (node) => {
        if (!node) return;
        helper(node.right);
        helper(node.left);
        node.right = prev;
        node.left = null;
        prev = node;
    };
    helper(root);
};`,
      python: `def flatten(root):
    prev = None
    def helper(node):
        nonlocal prev
        if not node:
            return
        helper(node.right)
        helper(node.left)
        node.right = prev
        node.left = None
        prev = node
    helper(root)`,
      java: `public void flatten(TreeNode root) {
    TreeNode[] prev = new TreeNode[1];
    helper(root, prev);
}
private void helper(TreeNode node, TreeNode[] prev) {
    if (node == null) return;
    helper(node.right, prev);
    helper(node.left, prev);
    node.right = prev[0];
    node.left = null;
    prev[0] = node;
}`,
      cpp: `void flatten(TreeNode* root) {
    TreeNode* prev = nullptr;
    function<void(TreeNode*)> helper = [&](TreeNode* node) {
        if (!node) return;
        helper(node->right);
        helper(node->left);
        node->right = prev;
        node->left = nullptr;
        prev = node;
    };
    helper(root);
}`,
    },
    hints: [
      "Think about modifying the tree during a traversal",
      "A reverse preorder traversal can help you link nodes correctly",
      "Keep track of the previous node visited",
    ],
  },
  {
    id: "20",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    topics: ["Array", "Heap", "Hash Table", "Bucket Sort"],
    companies: ["Amazon", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
    description:
      "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    approach:
      "Count element frequencies using a hash map, then use a heap or bucket sort to get top K elements.",
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(n)",
    pattern: "Heap / Bucket Sort",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `var topKFrequent = function(nums, k) {
    const freqMap = new Map();
    for (let num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    return Array.from(freqMap.entries())
                .sort((a,b) => b[1] - a[1])
                .slice(0, k)
                .map(x => x[0]);
};`,
      python: `from collections import Counter
def topKFrequent(nums, k):
    count = Counter(nums)
    return [item for item, _ in count.most_common(k)]`,
      java: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int n : nums)
        count.put(n, count.getOrDefault(n, 0) + 1);
    PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> count.get(a) - count.get(b));
    for (int n : count.keySet()) {
        heap.add(n);
        if (heap.size() > k) heap.poll();
    }
    int[] res = new int[k];
    for (int i = k - 1; i >= 0; i--)
        res[i] = heap.poll();
    return res;
}`,
      cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> count;
    for (int n : nums) count[n]++;
    priority_queue<pair<int, int>, vector<pair<int,int>>, greater<>> heap;
    for (auto& [num, freq] : count) {
        heap.push({freq, num});
        if (heap.size() > k) heap.pop();
    }
    vector<int> res;
    while (!heap.empty()) {
        res.push_back(heap.top().second);
        heap.pop();
    }
    return res;
}`,
    },
    hints: [
      "Count frequency of each element first",
      "A heap can be used to keep track of top K",
      "Bucket sort can also solve this in O(n)",
    ],
  },
  {
    id: "21",
    title: "Count Inversions",
    difficulty: "Hard",
    topics: ["Array", "Divide and Conquer", "Merge Sort"],
    companies: ["TCS Digital"],
    leetcodeUrl: "https://www.geeksforgeeks.org/counting-inversions/",
    description:
      "Given an array, find the number of inversions, where an inversion is when a[i] > a[j] for i < j.",
    approach:
      "Use modified merge sort to count inversions during merging step.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    pattern: "Merge Sort",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function countInversions(arr) {
    function mergeSort(nums) {
        if (nums.length <= 1) return [nums, 0];
        let mid = Math.floor(nums.length / 2);
        let [left, leftCount] = mergeSort(nums.slice(0, mid));
        let [right, rightCount] = mergeSort(nums.slice(mid));
        let merged = [], count = leftCount + rightCount, i = 0, j = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) merged.push(left[i++]);
            else {
                merged.push(right[j++]);
                count += left.length - i;
            }
        }
        return [merged.concat(left.slice(i)).concat(right.slice(j)), count];
    }
    return mergeSort(arr)[1];
}`,
      python: `def countInversions(arr):
    def merge_sort(nums):
        if len(nums) <= 1:
            return nums, 0
        mid = len(nums) // 2
        left, left_inv = merge_sort(nums[:mid])
        right, right_inv = merge_sort(nums[mid:])
        merged, i, j, inv_count = [], 0, 0, left_inv + right_inv
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                j += 1
                inv_count += len(left) - i
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged, inv_count
    return merge_sort(arr)[1]`,
      java: `class Solution {
    long inversionCount(long arr[], long N) {
        return mergeSort(arr, 0, N-1);
    }
    long mergeSort(long arr[], long l, long r) {
        long count = 0;
        if (l < r) {
            long m = (l + r) / 2;
            count += mergeSort(arr, l, m);
            count += mergeSort(arr, m+1, r);
            count += merge(arr, l, m, r);
        }
        return count;
    }
    long merge(long arr[], long l, long m, long r) {
        long left[] = Arrays.copyOfRange(arr, (int)l, (int)m+1);
        long right[] = Arrays.copyOfRange(arr, (int)m+1, (int)r+1);
        int i=0, j=0, k=(int)l;
        long swaps = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) arr[k++] = left[i++];
            else {
                arr[k++] = right[j++];
                swaps += left.length - i;
            }
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
        return swaps;
    }
}`,
      cpp: `long long merge(vector<long long>& arr, int l, int m, int r) {
    vector<long long> left(arr.begin()+l, arr.begin()+m+1);
    vector<long long> right(arr.begin()+m+1, arr.begin()+r+1);
    int i=0, j=0, k=l;
    long long swaps = 0;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else {
            arr[k++] = right[j++];
            swaps += left.size() - i;
        }
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
    return swaps;
}
long long mergeSort(vector<long long>& arr, int l, int r) {
    long long count = 0;
    if (l < r) {
        int m = (l + r) / 2;
        count += mergeSort(arr, l, m);
        count += mergeSort(arr, m+1, r);
        count += merge(arr, l, m, r);
    }
    return count;
}`,
    },
    hints: [
      "An inversion is when a larger number comes before a smaller one",
      "Think about merge sort's merge step",
      "Count how many elements remain in the left half when a right half element is smaller",
    ],
  },
  {
    id: "22",
    title: "Rat in a Maze",
    difficulty: "Medium",
    topics: ["Backtracking", "Matrix"],
    companies: ["Wipro", "Persistent"],
    leetcodeUrl:
      "https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1",
    description:
      "Given an N x N maze with obstacles, find all possible paths for the rat to reach from (0,0) to (N-1,N-1) using only safe cells.",
    approach:
      "Use DFS backtracking to explore all directions, marking visited cells and backtracking when needed.",
    timeComplexity: "O(4^(n^2))",
    spaceComplexity: "O(n^2)",
    pattern: "Backtracking",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function findPaths(maze, n) {
    let paths = [];
    let visited = Array.from({ length: n }, () => Array(n).fill(false));
    const dfs = (x, y, path) => {
        if (x === n-1 && y === n-1) {
            paths.push(path);
            return;
        }
        let dirs = [[1,0,'D'],[0,-1,'L'],[0,1,'R'],[-1,0,'U']];
        visited[x][y] = true;
        for (let [dx, dy, move] of dirs) {
            let nx = x+dx, ny = y+dy;
            if (nx>=0 && ny>=0 && nx<n && ny<n && maze[nx][ny] === 1 && !visited[nx][ny]) {
                dfs(nx, ny, path+move);
            }
        }
        visited[x][y] = false;
    };
    if (maze[0][0] === 1) dfs(0, 0, '');
    return paths;
}`,
      python: `def rat_in_maze(maze, n):
    res = []
    visited = [[False]*n for _ in range(n)]
    def dfs(x, y, path):
        if x == n-1 and y == n-1:
            res.append(path)
            return
        visited[x][y] = True
        dirs = [(1,0,'D'),(0,-1,'L'),(0,1,'R'),(-1,0,'U')]
        for dx, dy, move in dirs:
            nx, ny = x+dx, y+dy
            if 0 <= nx < n and 0 <= ny < n and maze[nx][ny] == 1 and not visited[nx][ny]:
                dfs(nx, ny, path+move)
        visited[x][y] = False
    if maze[0][0] == 1:
        dfs(0, 0, "")
    return res`,
      java: `class Solution {
    public ArrayList<String> findPath(int[][] m, int n) {
        ArrayList<String> res = new ArrayList<>();
        boolean[][] visited = new boolean[n][n];
        dfs(0, 0, m, n, "", res, visited);
        return res;
    }
    void dfs(int x, int y, int[][] m, int n, String path, ArrayList<String> res, boolean[][] visited) {
        if (x == n-1 && y == n-1) {
            res.add(path);
            return;
        }
        visited[x][y] = true;
        int[] dx = {1, 0, 0, -1};
        int[] dy = {0, -1, 1, 0};
        char[] dir = {'D', 'L', 'R', 'U'};
        for (int i = 0; i < 4; i++) {
            int nx = x + dx[i], ny = y + dy[i];
            if (nx >= 0 && ny >= 0 && nx < n && ny < n && m[nx][ny] == 1 && !visited[nx][ny]) {
                dfs(nx, ny, m, n, path + dir[i], res, visited);
            }
        }
        visited[x][y] = false;
    }
}`,
      cpp: `class Solution{
public:
    vector<string> findPath(vector<vector<int>> &m, int n) {
        vector<string> res;
        vector<vector<bool>> visited(n, vector<bool>(n, false));
        function<void(int,int,string)> dfs = [&](int x, int y, string path) {
            if (x == n-1 && y == n-1) {
                res.push_back(path);
                return;
            }
            visited[x][y] = true;
            int dx[4] = {1, 0, 0, -1};
            int dy[4] = {0, -1, 1, 0};
            char dir[4] = {'D', 'L', 'R', 'U'};
            for (int i=0; i<4; i++) {
                int nx = x + dx[i], ny = y + dy[i];
                if (nx>=0 && ny>=0 && nx<n && ny<n && m[nx][ny]==1 && !visited[nx][ny]) {
                    dfs(nx, ny, path + dir[i]);
                }
            }
            visited[x][y] = false;
        };
        if (m[0][0] == 1) dfs(0, 0, "");
        return res;
    }
};`,
    },
    hints: [
      "You can move in four directions: Down, Left, Right, Up",
      "Mark cells as visited before exploring neighbors",
      "Backtrack after exploring each path",
    ],
  },
  {
    id: "23",
    title: "N-Queens Problem",
    difficulty: "Hard",
    topics: ["Backtracking"],
    companies: ["Zoho", "PayU"],
    leetcodeUrl: "https://leetcode.com/problems/n-queens/",
    description:
      "Place N queens on an N×N chessboard so that no two queens attack each other. Return all distinct solutions.",
    approach:
      "Use backtracking with column, diagonal, and anti-diagonal tracking to prune invalid placements.",
    timeComplexity: "O(N!)",
    spaceComplexity: "O(N)",
    pattern: "Backtracking",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `var solveNQueens = function(n) {
    const res = [];
    const board = Array.from({length: n}, () => '.'.repeat(n));
    const cols = new Set(), diag1 = new Set(), diag2 = new Set();
    const backtrack = (r, curBoard) => {
        if (r === n) {
            res.push([...curBoard]);
            return;
        }
        for (let c = 0; c < n; c++) {
            if (cols.has(c) || diag1.has(r-c) || diag2.has(r+c)) continue;
            cols.add(c); diag1.add(r-c); diag2.add(r+c);
            curBoard[r] = '.'.repeat(c) + 'Q' + '.'.repeat(n-c-1);
            backtrack(r+1, curBoard);
            cols.delete(c); diag1.delete(r-c); diag2.delete(r+c);
        }
    };
    backtrack(0, [...board]);
    return res;
};`,
      python: `def solveNQueens(n):
    res = []
    board = [["."]*n for _ in range(n)]
    cols, diag1, diag2 = set(), set(), set()
    def backtrack(r):
        if r == n:
            res.append(["".join(row) for row in board])
            return
        for c in range(n):
            if c in cols or (r-c) in diag1 or (r+c) in diag2:
                continue
            cols.add(c); diag1.add(r-c); diag2.add(r+c)
            board[r][c] = "Q"
            backtrack(r+1)
            board[r][c] = "."
            cols.remove(c); diag1.remove(r-c); diag2.remove(r+c)
    backtrack(0)
    return res`,
      java: `class Solution {
    List<List<String>> res = new ArrayList<>();
    public List<List<String>> solveNQueens(int n) {
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        backtrack(0, board, new HashSet<>(), new HashSet<>(), new HashSet<>());
        return res;
    }
    void backtrack(int r, char[][] board, Set<Integer> cols, Set<Integer> d1, Set<Integer> d2) {
        int n = board.length;
        if (r == n) {
            List<String> sol = new ArrayList<>();
            for (char[] row : board) sol.add(new String(row));
            res.add(sol);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.contains(c) || d1.contains(r-c) || d2.contains(r+c)) continue;
            cols.add(c); d1.add(r-c); d2.add(r+c);
            board[r][c] = 'Q';
            backtrack(r+1, board, cols, d1, d2);
            board[r][c] = '.';
            cols.remove(c); d1.remove(r-c); d2.remove(r+c);
        }
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<string>> res;
    void backtrack(int r, vector<string>& board, set<int>& cols, set<int>& d1, set<int>& d2, int n) {
        if (r == n) {
            res.push_back(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.count(c) || d1.count(r-c) || d2.count(r+c)) continue;
            cols.insert(c); d1.insert(r-c); d2.insert(r+c);
            board[r][c] = 'Q';
            backtrack(r+1, board, cols, d1, d2, n);
            board[r][c] = '.';
            cols.erase(c); d1.erase(r-c); d2.erase(r+c);
        }
    }
    vector<vector<string>> solveNQueens(int n) {
        vector<string> board(n, string(n, '.'));
        set<int> cols, d1, d2;
        backtrack(0, board, cols, d1, d2, n);
        return res;
    }
};`,
    },
    hints: [
      "Track attacked columns and diagonals to prune search",
      "Place one queen per row",
      "Use sets or boolean arrays for O(1) attack checks",
    ],
  },
  {
    id: "24",
    title: "Dijkstra’s Shortest Path",
    difficulty: "Medium",
    topics: ["Graph", "Dijkstra", "Priority Queue"],
    companies: ["Oracle", "SAP Labs"],
    leetcodeUrl: "https://leetcode.com/problems/network-delay-time/",
    description:
      "Given a weighted graph, find the shortest distance from a source node to all other nodes using Dijkstra’s algorithm.",
    approach:
      "Use a min-heap to greedily select the next closest vertex and relax edges.",
    timeComplexity: "O((V+E) log V)",
    spaceComplexity: "O(V+E)",
    pattern: "Dijkstra's Algorithm",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function dijkstra(graph, src) {
    const dist = Array(graph.length).fill(Infinity);
    dist[src] = 0;
    const pq = [[0, src]];
    while (pq.length) {
        pq.sort((a,b)=>a[0]-b[0]);
        const [d, u] = pq.shift();
        if (d > dist[u]) continue;
        for (const [v, w] of graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push([dist[v], v]);
            }
        }
    }
    return dist;
}`,
      python: `import heapq
def dijkstra(graph, src):
    dist = [float('inf')] * len(graph)
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
      java: `class Solution {
    public int[] dijkstra(int V, List<List<int[]>> adj, int src) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
        pq.add(new int[]{0, src});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0], u = cur[1];
            if (d > dist[u]) continue;
            for (int[] edge : adj.get(u)) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.add(new int[]{dist[v], v});
                }
            }
        }
        return dist;
    }
}`,
      cpp: `vector<int> dijkstra(int V, vector<vector<pair<int,int>>>& adj, int src) {
    vector<int> dist(V, INT_MAX);
    dist[src] = 0;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
    },
    hints: [
      "Use a priority queue to always expand the closest vertex",
      "Relax each edge only if a shorter path is found",
      "Skip nodes if the current distance is already larger",
    ],
  },
  {
    id: "25",
    title: "Minimum Spanning Tree (Kruskal/Prim)",
    difficulty: "Medium",
    topics: ["Graph", "MST", "Kruskal", "Prim"],
    companies: ["Tech Mahindra"],
    leetcodeUrl:
      "https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1",
    description:
      "Find the weight of the Minimum Spanning Tree of a connected, undirected graph using Kruskal’s or Prim’s algorithm.",
    approach:
      "Kruskal: sort edges by weight and union-find to avoid cycles. Prim: use priority queue to grow MST from a starting vertex.",
    timeComplexity: "O(E log E)",
    spaceComplexity: "O(V+E)",
    pattern: "Graph MST",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `function kruskal(V, edges) {
    edges.sort((a,b) => a[2] - b[2]);
    const parent = Array.from({length: V}, (_, i) => i);
    const find = x => parent[x] === x ? x : parent[x] = find(parent[x]);
    const union = (a,b) => parent[find(a)] = find(b);
    let weight = 0;
    for (let [u,v,w] of edges) {
        if (find(u) !== find(v)) {
            union(u,v);
            weight += w;
        }
    }
    return weight;
}`,
      python: `def kruskal(V, edges):
    parent = list(range(V))
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    def union(a,b):
        parent[find(a)] = find(b)
    edges.sort(key=lambda x: x[2])
    weight = 0
    for u,v,w in edges:
        if find(u) != find(v):
            union(u,v)
            weight += w
    return weight`,
      java: `class Solution {
    int find(int[] parent, int x) {
        if (parent[x] != x) parent[x] = find(parent, parent[x]);
        return parent[x];
    }
    void union(int[] parent, int a, int b) {
        parent[find(parent, a)] = find(parent, b);
    }
    int kruskal(int V, int[][] edges) {
        Arrays.sort(edges, (a,b)->a[2]-b[2]);
        int[] parent = new int[V];
        for (int i=0;i<V;i++) parent[i] = i;
        int weight = 0;
        for (int[] e : edges) {
            if (find(parent, e[0]) != find(parent, e[1])) {
                union(parent, e[0], e[1]);
                weight += e[2];
            }
        }
        return weight;
    }
}`,
      cpp: `int find(vector<int>& parent, int x) {
    if (parent[x] != x) parent[x] = find(parent, parent[x]);
    return parent[x];
}
void unionSets(vector<int>& parent, int a, int b) {
    parent[find(parent, a)] = find(parent, b);
}
int kruskal(int V, vector<array<int,3>>& edges) {
    sort(edges.begin(), edges.end(), [](auto &a, auto &b){ return a[2] < b[2]; });
    vector<int> parent(V);
    iota(parent.begin(), parent.end(), 0);
    int weight = 0;
    for (auto &e : edges) {
        if (find(parent, e[0]) != find(parent, e[1])) {
            unionSets(parent, e[0], e[1]);
            weight += e[2];
        }
    }
    return weight;
}`,
    },
    hints: [
      "For Kruskal, sort edges by weight and avoid cycles",
      "For Prim, grow MST from a single vertex",
      "Union-find helps track connected components",
    ],
  },
  {
    id: "26",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    topics: ["Binary Tree", "DFS", "String"],
    companies: ["Amazon"],
    leetcodeUrl:
      "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    description:
      "Design an algorithm to serialize and deserialize a binary tree — converting it to a string and back.",
    approach:
      "Use preorder traversal to `serialize`, representing nulls explicitly; use a queue to `deserialize` recursively.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "Tree Serialization",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `var serialize = function(root) {
    const arr = [];
    function dfs(node) {
        if (!node) {
            arr.push("#");
            return;
        }
        arr.push(node.val.toString());
        dfs(node.left);
        dfs(node.right);
    }
    dfs(root);
    return arr.join(",");
};

var deserialize = function(data) {
    const nodes = data.split(",");
    function dfs() {
        const val = nodes.shift();
        if (val === "#") return null;
        const node = new TreeNode(parseInt(val));
        node.left = dfs();
        node.right = dfs();
        return node;
    }
    return dfs();
};`,
      python: `def serialize(root):
    vals = []
    def dfs(node):
        if not node:
            vals.append("#")
            return
        vals.append(str(node.val))
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return ",".join(vals)

def deserialize(data):
    nodes = data.split(",")
    def dfs():
        val = nodes.pop(0)
        if val == "#":
            return None
        node = TreeNode(int(val))
        node.left = dfs()
        node.right = dfs()
        return node
    return dfs()`,
      java: `public class Codec {
    private static final String SEP = ",";
    private static final String NULL = "#";

    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb);
        return sb.toString();
    }

    private void buildString(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append(NULL).append(SEP);
            return;
        }
        sb.append(node.val).append(SEP);
        buildString(node.left, sb);
        buildString(node.right, sb);
    }

    public TreeNode deserialize(String data) {
        Queue<String> nodes = new LinkedList<>(Arrays.asList(data.split(SEP)));
        return buildTree(nodes);
    }

    private TreeNode buildTree(Queue<String> nodes) {
        String val = nodes.poll();
        if (val.equals(NULL)) return null;
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = buildTree(nodes);
        node.right = buildTree(nodes);
        return node;
    }
}`,
      cpp: `class Codec {
public:
    string serialize(TreeNode* root) {
        ostringstream out;
        dfsSerialize(root, out);
        return out.str();
    }

    TreeNode* deserialize(const string& data) {
        istringstream in(data);
        return dfsDeserialize(in);
    }

private:
    void dfsSerialize(TreeNode* node, ostringstream& out) {
        if (!node) {
            out << "#,";
            return;
        }
        out << node->val << ',';
        dfsSerialize(node->left, out);
        dfsSerialize(node->right, out);
    }

    TreeNode* dfsDeserialize(istringstream& in) {
        string val;
        if (!getline(in, val, ',')) return nullptr;
        if (val == "#") return nullptr;
        TreeNode* node = new TreeNode(stoi(val));
        node->left = dfsDeserialize(in);
        node->right = dfsDeserialize(in);
        return node;
    }
};`,
    },
    hints: [
      "Include placeholders for null (e.g., '#') during serialization",
      "Use preorder traversal for both serialize and deserialize",
      "Maintain node order using a queue or index during deserialization",
    ],
  },
  {
    id: "27",
    title: "Trie Implementation",
    difficulty: "Medium",
    topics: ["Trie", "Design", "String"],
    companies: ["Flipkart"],
    leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    description:
      "Implement a trie (prefix tree) with insert, search, and startsWith operations.",
    approach:
      "Use a tree of nodes each holding children map and end-of-word flag.",
    timeComplexity: "O(log Σ * L)",
    spaceComplexity: "O(N * L)",
    pattern: "Trie",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `var Trie = function() {
    this.root = {};
};

Trie.prototype.insert = function(word) {
    let node = this.root;
    for (const c of word) {
        if (!node[c]) node[c] = {};
        node = node[c];
    }
    node.isWord = true;
};

Trie.prototype.search = function(word) {
    let node = this.root;
    for (const c of word) {
        if (!node[c]) return false;
        node = node[c];
    }
    return !!node.isWord;
};

Trie.prototype.startsWith = function(prefix) {
    let node = this.root;
    for (const c of prefix) {
        if (!node[c]) return false;
        node = node[c];
    }
    return true;
};`,
      python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.isWord = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.isWord = True

    def search(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                return False
            node = node.children[c]
        return node.isWord

    def startsWith(self, prefix):
        node = self.root
        for c in prefix:
            if c not in node.children:
                return False
            node = node.children[c]
        return True`,
      java: `class Trie {
    private class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isWord = false;
    }

    private TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node = node.children.computeIfAbsent(c, k -> new TrieNode());
        }
        node.isWord = true;
    }

    public boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node = node.children.get(c);
            if (node == null) return false;
        }
        return node.isWord;
    }

    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            node = node.children.get(c);
            if (node == null) return false;
        }
        return true;
    }
}`,
      cpp: `class Trie {
    struct Node {
        array<Node*, 26> children{};
        bool isWord = false;
        Node() { children.fill(nullptr); }
    };

    Node* root;

public:
    Trie() { root = new Node(); }

    void insert(const string& word) {
        Node* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) node->children[idx] = new Node();
            node = node->children[idx];
        }
        node->isWord = true;
    }

    bool search(const string& word) {
        Node* node = root;
        for (char c : word) {
            node = node->children[c - 'a'];
            if (!node) return false;
        }
        return node->isWord;
    }

    bool startsWith(const string& prefix) {
        Node* node = root;
        for (char c : prefix) {
            node = node->children[c - 'a'];
            if (!node) return false;
        }
        return true;
    }
};`,
    },
    hints: [
      "Use a node per character, with a map or fixed-size array of children",
      "Mark the end of a valid word in the node",
      "Traversals in insert, search, and startsWith are almost identical",
    ],
  },
  {
    id: "28",
    title: "Sliding Window Pattern",
    difficulty: "Medium",
    topics: ["Sliding Window", "Two Pointers"],
    companies: ["Swiggy", "Paytm"],
    leetcodeUrl: "https://leetcode.com/problems/minimum-size-subarray-sum/",
    description:
      "Use the sliding window approach for array problems like finding subarrays meeting specific criteria (e.g., sum at least target).",
    approach:
      "Maintain two pointers defining a window and dynamically resize it to meet conditions optimally.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Sliding Window",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `var minSubArrayLen = function(target, nums) {
    let left = 0, sum = 0, minLen = Infinity;
    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLen === Infinity ? 0 : minLen;
};`,
      python: `def minSubArrayLen(target, nums):
    left = 0
    total = 0
    min_len = float('inf')
    for right, num in enumerate(nums):
        total += num
        while total >= target:
            min_len = min(min_len, right - left + 1)
            total -= nums[left]
            left += 1
    return 0 if min_len == float('inf') else min_len`,
      java: `public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, minLen = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}`,
      cpp: `int minSubArrayLen(int target, vector<int>& nums) {
    int left = 0, sum = 0, minLen = INT_MAX;
    for (int right = 0; right < nums.size(); right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = min(minLen, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLen == INT_MAX ? 0 : minLen;
}`,
    },
    hints: [
      "Expand the window until condition is met, then shrink from the left",
      "Track sum or other aggregate incrementally",
      "Update result when window satisfies the condition",
    ],
  },
  {
    id: "29",
    title: "Recursion + Backtracking Combo Qs",
    difficulty: "Medium",
    topics: ["Recursion", "Backtracking"],
    companies: ["Google", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/combination-sum/",
    description:
      "Solve problems that require both recursion and backtracking techniques, such as finding combinations that sum to a target.",
    approach:
      "Use recursive DFS with backtracking to build combinations, pruning choices that exceed the target.",
    timeComplexity: "O(N^{target/min}), depends on branching",
    spaceComplexity: "O(target/min)",
    pattern: "Backtracking",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `var combinationSum = function(candidates, target) {
    const res = [];
    const dfs = (start, path, sum) => {
        if (sum === target) {
            res.push([...path]);
            return;
        }
        if (sum > target) return;
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            dfs(i, path, sum + candidates[i]);
            path.pop();
        }
    };
    dfs(0, [], 0);
    return res;
};`,
      python: `def combinationSum(candidates, target):
    res = []
    def backtrack(start, comb, total):
        if total == target:
            res.append(list(comb))
            return
        if total > target:
            return
        for i in range(start, len(candidates)):
            comb.append(candidates[i])
            backtrack(i, comb, total + candidates[i])
            comb.pop()
    backtrack(0, [], 0)
    return res`,
      java: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), res);
        return res;
    }
    private void backtrack(int[] candidates, int target, int start, List<Integer> comb, List<List<Integer>> res) {
        if (target == 0) {
            res.add(new ArrayList<>(comb));
            return;
        }
        if (target < 0) return;
        for (int i = start; i < candidates.length; i++) {
            comb.add(candidates[i]);
            backtrack(candidates, target - candidates[i], i, comb, res);
            comb.remove(comb.size() - 1);
        }
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> res;
        vector<int> comb;
        function<void(int, int)> dfs = [&](int start, int total) {
            if (total == target) {
                res.push_back(comb);
                return;
            }
            if (total > target) return;
            for (int i = start; i < candidates.size(); i++) {
                comb.push_back(candidates[i]);
                dfs(i, total + candidates[i]);
                comb.pop_back();
            }
        };
        dfs(0, 0);
        return res;
    }
};`,
    },
    hints: [
      "Recurse by including or excluding candidates",
      "Backtrack when sum exceeds target",
      "Avoid duplicates by controlling the start index",
    ],
  },
  {
    id: "30",
    title: "Binary Search on Answer Problems",
    difficulty: "Medium",
    topics: ["Binary Search", "Binary Search on Answer"],
    companies: ["Samsung", "Ola"],
    leetcodeUrl: "https://leetcode.com/problems/koko-eating-bananas/",
    description:
      "Use 'binary search on answer' pattern to solve problems where you search over the solution space rather than the input directly.",
    approach:
      "Define feasible function and binary search over possible answer space (e.g., rate, capacity).",
    timeComplexity: "O(n log(Max–Min))",
    spaceComplexity: "O(1)",
    pattern: "Binary Search on Answer",
    completed: false,
    bookmarked: false,
    notes: "",
    solution: {
      javascript: `var minEatingSpeed = function(piles, h) {
    let lo = 1, hi = Math.max(...piles);
    const canEat = rate => {
        let hours = 0;
        for (let p of piles) hours += Math.ceil(p / rate);
        return hours <= h;
    };
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (canEat(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
};`,
      python: `import math
def minEatingSpeed(piles, h):
    lo, hi = 1, max(piles)
    def can_eat(rate):
        return sum(math.ceil(p / rate) for p in piles) <= h
    while lo < hi:
        mid = (lo + hi) // 2
        if can_eat(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      java: `class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int lo = 1, hi = Arrays.stream(piles).max().getAsInt();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (canEat(piles, h, mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
    private boolean canEat(int[] piles, int h, int rate) {
        int hours = 0;
        for (int p : piles) {
            hours += (p + rate - 1) / rate;
        }
        return hours <= h;
    }
}`,
      cpp: `class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int lo = 1;
        int hi = *max_element(piles.begin(), piles.end());
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            long long hours = 0;
            for (int p : piles) {
                hours += (p + mid - 1) / mid;
            }
            if (hours <= h) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};`,
    },
    hints: [
      "Think of the answer as a parameter to binary search",
      "Write a helper function to check feasibility of a given answer",
      "Search between realistic bounds derived from the input",
    ],
  },
];

export const topicCategories = [
  "All",
  "Array",
  "String",
  "Linked List",
  "Stack",
  "Queue",
  "Hash Table",
  "Tree",
  "Graph",
  "Dynamic Programming",
  "Greedy",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Sorting",
  "Backtracking",
  "Divide and Conquer",
  "Bit Manipulation",
  "Design",
  "Matrix",
  "Heap",
];

export const companyList = [
  "All",
  "Amazon",
  "Google",
  "Microsoft",
  "Facebook",
  "Apple",
  "TCS",
  "Wipro",
  "Infosys",
  "Accenture",
  "Capgemini",
  "Adobe",
  "Paytm",
  "Flipkart",
  "Zomato",
  "Swiggy",
  "PhonePe",
  "Zerodha",
  "Uber",
  "Ola",
  "Bloomberg",
  "LinkedIn",
  "Netflix",
  "Airbnb",
  "Twitter",
  "Spotify",
  "Yahoo",
  "IBM",
  "Oracle",
  "SAP Labs",
  "Tech Mahindra",
  "Cognizant",
  "Persistent",
  "Zoho",
  "PayU",
  "DE Shaw",
  "Goldman Sachs",
  "Atlassian",
  "Samsung",
  "TCS Digital",
];

export const difficultyLevels = ["All", "Easy", "Medium", "Hard"];

export const patterns = [
  "All",
  "Hash Table",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Dynamic Programming",
  "Greedy",
  "Backtracking",
  "Tree Traversal",
  "Graph Traversal",
  "Binary Search",
  "Linked List",
  "Sorting",
  "Divide and Conquer",
  "Matrix",
  "Design",
];

// Helper functions
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "Hard":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export const getProgressStats = (problems: DSAProblem[]) => {
  const total = problems.length;
  const completed = problems.filter((p) => p.completed).length;
  const neuronCompleted = problems.filter((p) => (p as any).neuronSessionCompleted).length;
  const easy = problems.filter((p) => p.difficulty === "Easy");
  const medium = problems.filter((p) => p.difficulty === "Medium");
  const hard = problems.filter((p) => p.difficulty === "Hard");

  return {
    total,
    completed,
    neuronCompleted,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    neuronPercentage: total > 0 ? Math.round((neuronCompleted / total) * 100) : 0,
    easy: {
      total: easy.length,
      completed: easy.filter((p) => p.completed).length,
      neuronCompleted: easy.filter((p) => (p as any).neuronSessionCompleted).length,
    },
    medium: {
      total: medium.length,
      completed: medium.filter((p) => p.completed).length,
      neuronCompleted: medium.filter((p) => (p as any).neuronSessionCompleted).length,
    },
    hard: {
      total: hard.length,
      completed: hard.filter((p) => p.completed).length,
      neuronCompleted: hard.filter((p) => (p as any).neuronSessionCompleted).length,
    },
  };
};
